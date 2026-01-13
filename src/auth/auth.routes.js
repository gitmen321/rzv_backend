const express = require('express');
const router = express.Router();
const isValidToken = require('../middlewares/auth.middleware');

const authController =  require('./auth.controller');

router.post('/login', authController.loginValidation);
router.get('/profile', isValidToken, authController.getProfile);

module.exports = router;
