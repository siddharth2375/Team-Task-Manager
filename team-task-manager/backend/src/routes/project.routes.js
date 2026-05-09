const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const { PROJECT_ROLES } = require('../constants/roles');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireProjectRole } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  memberParamsSchema,
  updateMemberRoleSchema,
} = require('../validators/project.validator');

router.use(requireAuth);

router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/', projectController.listProjects);
router.get('/:id', validate(projectIdSchema), projectController.getProject);
router.patch(
  '/:id',
  validate(updateProjectSchema),
  requireProjectRole(PROJECT_ROLES.ADMIN),
  projectController.updateProject,
);
router.delete(
  '/:id',
  validate(projectIdSchema),
  requireProjectRole(PROJECT_ROLES.ADMIN),
  projectController.deleteProject,
);
router.post(
  '/:id/members',
  validate(addProjectMemberSchema),
  requireProjectRole(PROJECT_ROLES.ADMIN),
  projectController.addMember,
);
router.delete(
  '/:id/members/:userId',
  validate(memberParamsSchema),
  requireProjectRole(PROJECT_ROLES.ADMIN),
  projectController.removeMember,
);
router.patch(
  '/:id/members/:userId/role',
  validate(updateMemberRoleSchema),
  requireProjectRole(PROJECT_ROLES.ADMIN),
  projectController.updateMemberRole,
);

module.exports = router;