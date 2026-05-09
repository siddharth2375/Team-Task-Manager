const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const signup = asyncHandler(async (req, res) => {
  const data = await authService.signup(req.validated.body);
  res.status(201).json({ success: true, data });
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.validated.body);
  res.json({ success: true, data });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: authService.sanitizeUser(req.user) } });
});

module.exports = { signup, login, me };