const mongoose = require('mongoose');
const { GLOBAL_ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 80,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  globalRole: {
    type: String,
    enum: Object.values(GLOBAL_ROLES),
    default: GLOBAL_ROLES.MEMBER,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

module.exports = mongoose.model('User', userSchema);