const express = require('express');
const router = express.Router();
const validations = require('../middlewares/user_middleware');
const isAuthenticated = require('../middlewares/auth.middleware');
const rateLimit = require('../middlewares/rateLimit.middleware');
const isLoginvalid = require('../middlewares/login_middleware');
const authController = require('./auth.controller');


router.post('/login', rateLimit({
    windowSeconds: Number(process.env.LOGIN_RATE_WINDOW),
    maxRequests: Number(process.env.LOGIN_RATE_MAX),
    keyPrefix: "login"
}), isLoginvalid, authController.loginValidation);

router.post('/register',
     rateLimit({
        windowSeconds: Number(process.env.REGISTER_RATE_WINDOW),
        maxRequests: Number(process.env.REGISTER_RATE_MAX),
        keyPrefix: "register"
    }),
    validations.isValid, validations.validateEmail, validations.passwordConfirmation, authController.register);

router.get('/verify-email/:token', rateLimit({
    windowSeconds: 60,
    maxRequests: 5
}), validations.emailVerifyValidation, authController.verifyEmail);

router.post('/resend-verification', rateLimit({
    windowSeconds: 60,
    maxRequests: 3

}), validations.validateEmail, authController.resendVerifyEmail);

router.post('/refresh-token', rateLimit({
    windowSeconds: 60,
    maxRequests: 5,
    keyPrefix: "refreshToken"
}), authController.refreshToken);

router.post('/logout', isAuthenticated, authController.logout);

router.post('/forgot-password', rateLimit({
    windowSeconds: Number(process.env.FORGOT_PASS_RATE_WINDOW),
    maxRequests: Number(process.env.FORGOT_PASS_RATE_MAX),
    keyPrefix: "forgotPassword"
}), validations.forgotPasswordValidation, authController.forgotPassword);

router.post('/reset-password/:token', validations.resetPasswordValidation, authController.resetPassword);

module.exports = router;
