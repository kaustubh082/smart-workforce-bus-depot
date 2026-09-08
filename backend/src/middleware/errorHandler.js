export function notFoundHandler(_req, _res, next) { next(Object.assign(new Error('Endpoint not found.'), { status: 404 })); }
export function errorHandler(error, _req, res, _next) {
  const status = error.status || (error.code === 'ER_DUP_ENTRY' ? 409 : 500);
  if (status >= 500) console.error(error);
  res.status(status).json({ success: false, message: status === 500 ? 'An unexpected server error occurred.' : error.message });
}
