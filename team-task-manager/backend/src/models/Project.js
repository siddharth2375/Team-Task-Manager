const mongoose = require('mongoose');
const { PROJECT_ROLES } = require('../constants/roles');

const projectMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(PROJECT_ROLES),
      default: PROJECT_ROLES.MEMBER,
    },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: '',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [projectMemberSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Project', projectSchema);