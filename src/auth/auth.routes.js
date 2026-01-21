const express = require('express');
const router = express.Router();
const validations = require('../middlewares/user_middleware');
const isAuthenticated = require('../middlewares/auth.middleware');

const authController = require('./auth.controller');

router.post('/login', authController.loginValidation);
router.post('/register', validations.isValid, validations.validateEmail, validations.passwordConfirmation, authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', isAuthenticated, authController.logout);

module.exports = router;
