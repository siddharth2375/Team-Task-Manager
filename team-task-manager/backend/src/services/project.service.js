const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const { GLOBAL_ROLES, PROJECT_ROLES } = require('../constants/roles');

const projectPopulate = [
  { path: 'owner', select: 'name email globalRole' },
  { path: 'members.user', select: 'name email globalRole' },
];

const isGlobalAdmin = (user) => user.globalRole === GLOBAL_ROLES.ADMIN;

const getUserId = (value) => value?._id?.toString() || value?.toString();

const getMembershipRole = (project, user) => {
  if (isGlobalAdmin(user)) {
    return PROJECT_ROLES.ADMIN;
  }
  const member = project.members.find((entry) => getUserId(entry.user) === user._id.toString());
  return member ? member.role : null;
};

const createProject = async (user, payload) => {
  return Project.create({
    ...payload,
    owner: user._id,
    members: [{ user: user._id, role: PROJECT_ROLES.ADMIN }],
  });
};

const listProjects = async (user) => {
  const filter = isGlobalAdmin(user) ? {} : { 'members.user': user._id };
  return Project.find(filter).sort({ createdAt: -1 }).populate(projectPopulate);
};

const getAccessibleProject = async (projectId, user) => {
  const project = await Project.findById(projectId).populate(projectPopulate);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }
  if (!getMembershipRole(project, user)) {
    throw new ApiError(403, 'You do not have access to this project.');
  }
  return project;
};

const updateProject = async (project, payload) => {
  Object.assign(project, payload);
  await project.save();
  return project.populate(projectPopulate);
};

const deleteProject = async (project) => {
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
};

const addMember = async (project, { email, role }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const existingMember = project.members.find((entry) => entry.user.toString() === user._id.toString());
  if (existingMember) {
    existingMember.role = role;
  } else {
    project.members.push({ user: user._id, role });
  }

  await project.save();
  return project.populate(projectPopulate);
};

const removeMember = async (project, userId) => {
  if (getUserId(project.owner) === userId) {
    throw new ApiError(400, 'Project owner cannot be removed.');
  }

  const beforeCount = project.members.length;
  project.members = project.members.filter((entry) => getUserId(entry.user) !== userId);

  if (project.members.length === beforeCount) {
    throw new ApiError(404, 'Project member not found.');
  }

  await Task.updateMany({ project: project._id, assignee: userId }, { $set: { assignee: null } });
  await project.save();
  return project.populate(projectPopulate);
};

const updateMemberRole = async (project, userId, role) => {
  const member = project.members.find((entry) => getUserId(entry.user) === userId);
  if (!member) {
    throw new ApiError(404, 'Project member not found.');
  }
  member.role = role;
  await project.save();
  return project.populate(projectPopulate);
};

module.exports = {
  createProject,
  listProjects,
  getAccessibleProject,
  getMembershipRole,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
};