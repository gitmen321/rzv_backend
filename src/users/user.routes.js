const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth.middleware');
const userController = require('./user.controller');
const validations = require('../middlewares/user_middleware');
// const authorizeRole = require('../middlewares/authorizeRole');
// const { ROLE } = require('../constants/auth.constants');
const rateLimit = require('../middlewares/rateLimit.middleware');


router.get('/user/me', rateLimit({
    windowSeconds: Number(process.env.USER_RATE_WINDOW),
    maxRequests: Number(process.env.USER_RATE_RATE),
    keyPrefix: 'user-me'
}), isAuthenticated, userController.currentMe);

router.get('/user/wallet', isAuthenticated, userController.getWallet);

router.get('/user/transactions', isAuthenticated, validations.validDateRange, userController.getTransaction);

router.put('/user/update', isAuthenticated, validations.isValidUpdate, userController.updateMyProfile);



router.delete('/user/delete', isAuthenticated, userController.deleteUser);


module.exports = router;