const asyncHandler = require('../utils/asyncHandler');
const projectService = require('../services/project.service');

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user, req.validated.body);
  res.status(201).json({ success: true, data: { project } });
});

const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjects(req.user);
  res.json({ success: true, data: { projects } });
});

const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getAccessibleProject(req.validated.params.id, req.user);
  res.json({ success: true, data: { project } });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.project, req.validated.body);
  res.json({ success: true, data: { project } });
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.project);
  res.json({ success: true, data: { deleted: true } });
});

const addMember = asyncHandler(async (req, res) => {
  const project = await projectService.addMember(req.project, req.validated.body);
  res.status(201).json({ success: true, data: { project } });
});

const removeMember = asyncHandler(async (req, res) => {
  const project = await projectService.removeMember(req.project, req.validated.params.userId);
  res.json({ success: true, data: { project } });
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const project = await projectService.updateMemberRole(
    req.project,
    req.validated.params.userId,
    req.validated.body.role,
  );
  res.json({ success: true, data: { project } });
});

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
};