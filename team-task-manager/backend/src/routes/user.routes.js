const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, userController.listUsers);

module.exports = router;