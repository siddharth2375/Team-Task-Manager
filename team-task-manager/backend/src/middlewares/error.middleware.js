const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

const errorMiddleware = (error, req, res, _next) => {
  let normalizedError = error;

  if (error.name === 'ValidationError') {
    normalizedError = new ApiError(
      400,
      'Validation failed.',
      Object.values(error.errors).map((entry) => ({ path: entry.path, message: entry.message })),
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    normalizedError = new ApiError(400, `Invalid ${error.path}.`);
  }

  if (error.code === 11000) {
    normalizedError = new ApiError(409, 'A resource with this value already exists.');
  }

  if (!(normalizedError instanceof ApiError)) {
    normalizedError = new ApiError(500, 'Internal server error.');
  }

  const payload = {
    success: false,
    message: normalizedError.message,
  };

  if (normalizedError.errors) {
    payload.errors = normalizedError.errors;
  }

  if (env.NODE_ENV !== 'production' && normalizedError.statusCode === 500) {
    payload.stack = error.stack;
  }

  res.status(normalizedError.statusCode).json(payload);
};

module.exports = { errorMiddleware };