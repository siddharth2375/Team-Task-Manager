const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const search = req.query.search?.trim();
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(query).select('name email globalRole createdAt').limit(25).sort({ name: 1 });
  res.json({ success: true, data: { users } });
});

module.exports = { listUsers };