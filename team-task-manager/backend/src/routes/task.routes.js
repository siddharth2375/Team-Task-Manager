const router = require('express').Router({ mergeParams: true });
const taskController = require('../controllers/task.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} = require('../validators/task.validator');

router.use(requireAuth);

router.post('/:projectId/tasks', validate(createTaskSchema), taskController.createTask);
router.get('/:projectId/tasks', validate(listTasksSchema), taskController.listProjectTasks);
router.get('/:id', validate(taskIdSchema), taskController.getTask);
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', validate(taskIdSchema), taskController.deleteTask);

module.exports = router;