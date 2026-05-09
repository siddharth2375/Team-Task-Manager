const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { GLOBAL_ROLES, PROJECT_ROLES } = require('../constants/roles');

const roleRank = {
  [PROJECT_ROLES.MEMBER]: 1,
  [PROJECT_ROLES.ADMIN]: 2,
};

const getProjectRole = (project, user) => {
  if (user.globalRole === GLOBAL_ROLES.ADMIN) {
    return PROJECT_ROLES.ADMIN;
  }

  const member = project.members.find((entry) => entry.user.toString() === user._id.toString());
  return member ? member.role : null;
};

const requireProjectRole = (role) =>
  asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found.');
    }

    const projectRole = getProjectRole(project, req.user);
    if (!projectRole || roleRank[projectRole] < roleRank[role]) {
      throw new ApiError(403, 'You do not have permission to access this project.');
    }

    req.project = project;
    req.projectRole = projectRole;
    next();
  });

module.exports = { requireProjectRole, getProjectRole };