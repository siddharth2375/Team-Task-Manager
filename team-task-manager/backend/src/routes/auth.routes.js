const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { signupSchema, loginSchema } = require('../validators/auth.validator');

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', requireAuth, authController.me);

module.exports = router;