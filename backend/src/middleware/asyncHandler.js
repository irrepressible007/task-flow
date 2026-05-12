/**
 * asyncHandler.js — Async Error Wrapper Middleware
 *
 * Wraps an async route handler so that any rejected promise or thrown error
 * is automatically forwarded to Express's global error handler via next(err).
 *
 * Without this, every controller function needs its own try/catch block.
 * With this, controllers stay clean and focused on business logic only.
 *
 * Usage:
 *   router.get('/', asyncHandler(myController));
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
