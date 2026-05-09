const asyncHandler = require('../utils/asyncHandler');
const taskService = require('../services/task.service');

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(
    req.validated.params.projectId,
    req.user,
    req.validated.body,
  );
  res.status(201).json({ success: true, data: { task } });
});

const listProjectTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.listProjectTasks(
    req.validated.params.projectId,
    req.user,
    req.validated.query,
  );
  res.json({ success: true, data: { tasks } });
});

const getTask = asyncHandler(async (req, res) => {
  const { task } = await taskService.getAccessibleTask(req.validated.params.id, req.user);
  res.json({ success: true, data: { task } });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.validated.params.id, req.user, req.validated.body);
  res.json({ success: true, data: { task } });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.validated.params.id, req.user);
  res.json({ success: true, data: { deleted: true } });
});

module.exports = { createTask, listProjectTasks, getTask, updateTask, deleteTask };