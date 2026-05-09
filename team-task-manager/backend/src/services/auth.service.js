const bcrypt = require('bcrypt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  globalRole: user.globalRole,
  createdAt: user.createdAt,
});

const signup = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user);

  return { user: sanitizeUser(user), token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};

module.exports = { signup, login, sanitizeUser };