export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const notFound = (message = 'Resource not found.') => new ApiError(404, message);
