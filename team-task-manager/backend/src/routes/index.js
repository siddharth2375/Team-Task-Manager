const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/projects', require('./project.routes'));
router.use('/projects', require('./task.routes'));
router.use('/tasks', require('./task.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;