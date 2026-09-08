import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { transaction } from '../db/pool.js';
import { ApiError } from '../utils/errors.js';
import { audit } from './auditService.js';

const safeUser = (row) => ({ id: row.user_id, employeeDbId: row.employee_db_id, employeeId: row.employee_id, name: row.name, email: row.email, phone: row.phone, role: row.role.toLowerCase().replace('depot_manager','manager'), designation: row.designation, depotId: row.depot_id });
const createToken = (user) => jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export async function login(identifier, password) {
  if (!identifier || !password) throw new ApiError(400, 'Employee ID or email and password are required.');
  return transaction(async (connection) => {
    const [rows] = await connection.execute(`SELECT u.id user_id,u.password_hash,u.role,u.is_active,u.failed_login_attempts,u.locked_until,e.id employee_db_id,e.employee_id,e.name,e.email,e.phone,e.designation,e.depot_id FROM users u JOIN employees e ON e.id=u.employee_id WHERE e.email=? OR e.employee_id=? FOR UPDATE`, [identifier, identifier]);
    const user = rows[0];
    if (!user) throw new ApiError(401, 'Invalid credentials.');
    if (!user.is_active) throw new ApiError(403, 'This account is inactive.');
    if (user.locked_until && new Date(user.locked_until) > new Date()) throw new ApiError(423, 'Account is temporarily locked. Please try again later.');
    if (!(await bcrypt.compare(password, user.password_hash))) {
      const attempts = user.failed_login_attempts + 1;
      const locked = attempts >= 5;
      await connection.execute('UPDATE users SET failed_login_attempts=?, locked_until=? WHERE id=?', [locked ? 0 : attempts, locked ? new Date(Date.now() + 15 * 60 * 1000) : null, user.user_id]);
      await audit(connection, user.user_id, 'LOGIN_FAILURE', 'Invalid password supplied.');
      throw new ApiError(401, locked ? 'Too many failed attempts. Account locked for 15 minutes.' : 'Invalid credentials.');
    }
    await connection.execute('UPDATE users SET failed_login_attempts=0, locked_until=NULL WHERE id=?', [user.user_id]);
    await audit(connection, user.user_id, 'LOGIN', 'Successful login.');
    const safe = safeUser(user); return { token: createToken({ id: safe.id, role: user.role }), user: safe };
  });
}
export async function register(input) {
  const { employeeId, name, email, phone, role, password, confirmPassword } = input;
  if (!employeeId || !name || !email || !phone || !role || !password || !confirmPassword) throw new ApiError(400, 'All registration fields are required.');
  if (password !== confirmPassword) throw new ApiError(400, 'Passwords do not match.');
  if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters.');
  const dbRole = String(role).toUpperCase(); if (!['DRIVER','CONDUCTOR'].includes(dbRole)) throw new ApiError(403, 'Only drivers and conductors can self-register.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ApiError(400, 'Enter a valid email address.');
  return transaction(async (connection) => {
    const [existing] = await connection.execute('SELECT id FROM employees WHERE employee_id=? OR email=?', [employeeId, email]);
    if (existing.length) throw new ApiError(409, 'Employee ID or email is already registered.');
    const [employee] = await connection.execute('INSERT INTO employees (employee_id,name,email,phone,designation,joining_date,depot_id) VALUES (?,?,?,?,?,CURRENT_DATE,1)', [employeeId,name,email,phone,dbRole]);
    const hash = await bcrypt.hash(password, 12);
    const [user] = await connection.execute('INSERT INTO users (employee_id,email,password_hash,role) VALUES (?,?,?,?)', [employee.insertId,email,hash,dbRole]);
    await connection.execute('INSERT INTO leave_balances (employee_id) VALUES (?)', [employee.insertId]);
    const row = { user_id:user.insertId,employee_db_id:employee.insertId,employee_id:employeeId,name,email,phone,role:dbRole,designation:dbRole,depot_id:1 };
    await audit(connection, user.insertId, 'REGISTER', 'Self-registration completed.');
    const safe=safeUser(row); return { token:createToken({id:safe.id,role:dbRole}), user:safe };
  });
}
export { safeUser };
