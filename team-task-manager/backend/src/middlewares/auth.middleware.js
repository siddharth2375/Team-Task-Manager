const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwt');

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Authentication token is required.');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired token.');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, 'Authenticated user no longer exists.');
  }

  req.user = user;
  next();
});

module.exports = { requireAuth };