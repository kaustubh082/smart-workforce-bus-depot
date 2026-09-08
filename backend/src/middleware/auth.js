import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';
import { ApiError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) throw new ApiError(401, 'Authentication is required.');
  let payload;
  try { payload = jwt.verify(token, env.jwtSecret); } catch { throw new ApiError(401, 'Your session is invalid or expired.'); }
  const [rows] = await query(`SELECT u.id AS user_id,u.role,u.is_active,e.id AS employee_db_id,e.employee_id,e.name,e.email,e.phone,e.designation,e.depot_id
    FROM users u JOIN employees e ON e.id=u.employee_id WHERE u.id=?`, [payload.sub]);
  if (!rows[0] || !rows[0].is_active) throw new ApiError(401, 'This account is inactive.');
  req.user = rows[0]; next();
});
export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'You do not have permission to perform this action.'));
  next();
};
