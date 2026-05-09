const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { GLOBAL_ROLES, PROJECT_ROLES, TASK_STATUS } = require('../constants/roles');
const { getMembershipRole } = require('./project.service');

const taskPopulate = [
  { path: 'project', select: 'name description owner members createdAt' },
  { path: 'assignee', select: 'name email globalRole' },
  { path: 'createdBy', select: 'name email globalRole' },
];

const getUserId = (value) => value?._id?.toString() || value?.toString();

const ensureProjectMembership = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }
  const role = getMembershipRole(project, user);
  if (!role) {
    throw new ApiError(403, 'You do not have access to this project.');
  }
  return { project, role };
};

const ensureAssigneeIsMember = async (project, assigneeId) => {
  if (!assigneeId) {
    return;
  }
  const user = await User.findById(assigneeId);
  if (!user) {
    throw new ApiError(404, 'Assignee not found.');
  }
  const isMember = project.members.some((entry) => getUserId(entry.user) === assigneeId.toString());
  if (!isMember && user.globalRole !== GLOBAL_ROLES.ADMIN) {
    throw new ApiError(400, 'Assignee must be a project member.');
  }
};

const createTask = async (projectId, user, payload) => {
  const { project } = await ensureProjectMembership(projectId, user);
  await ensureAssigneeIsMember(project, payload.assignee);

  const task = await Task.create({ ...payload, project: project._id, createdBy: user._id });
  return task.populate(taskPopulate);
};

const listProjectTasks = async (projectId, user, filters) => {
  await ensureProjectMembership(projectId, user);
  const query = { project: projectId };

  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.assignee) {
    query.assignee = filters.assignee;
  }
  if (filters.overdue === 'true') {
    query.dueDate = { $lt: new Date() };
    query.status = { $ne: TASK_STATUS.DONE };
  }

  return Task.find(query).sort({ createdAt: -1 }).populate(taskPopulate);
};

const getAccessibleTask = async (taskId, user) => {
  const task = await Task.findById(taskId).populate(taskPopulate);
  if (!task) {
    throw new ApiError(404, 'Task not found.');
  }

  const role = getMembershipRole(task.project, user);
  if (!role) {
    throw new ApiError(403, 'You do not have access to this task.');
  }

  return { task, role };
};

const updateTask = async (taskId, user, payload) => {
  const { task, role } = await getAccessibleTask(taskId, user);
  const isAssignee = task.assignee && task.assignee._id.toString() === user._id.toString();
  const isProjectAdmin = role === PROJECT_ROLES.ADMIN;

  if (!isProjectAdmin) {
    const fields = Object.keys(payload);
    if (!isAssignee || fields.length !== 1 || fields[0] !== 'status') {
      throw new ApiError(403, 'Only project admins can update these task fields.');
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'assignee')) {
    await ensureAssigneeIsMember(task.project, payload.assignee);
  }

  Object.assign(task, payload);
  await task.save();
  return task.populate(taskPopulate);
};

const deleteTask = async (taskId, user) => {
  const { task, role } = await getAccessibleTask(taskId, user);
  const isCreator = getUserId(task.createdBy) === user._id.toString();
  if (role !== PROJECT_ROLES.ADMIN && !isCreator) {
    throw new ApiError(403, 'Only project admins or the task creator can delete this task.');
  }
  await task.deleteOne();
};

module.exports = { createTask, listProjectTasks, getAccessibleTask, updateTask, deleteTask };