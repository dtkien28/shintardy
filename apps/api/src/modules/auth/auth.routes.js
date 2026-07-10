const express = require('express');
const authController = require('./auth.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, authController.updateMe);

module.exports = router;
