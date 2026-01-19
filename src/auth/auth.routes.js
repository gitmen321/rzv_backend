const express = require('express');
const router = express.Router();
const validations = require('../middlewares/user_middleware');

const authController = require('./auth.controller');

router.post('/login', authController.loginValidation);
router.post('/register', validations.isValid, validations.validateEmail, validations.passwordConfirmation, authController.register);

module.exports = router;
