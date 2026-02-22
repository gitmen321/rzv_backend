const express = require('express');
const router = express.Router();
const authorizeRole = require('../middlewares/authorizeRole');
const isAuthenticated = require('../middlewares/auth.middleware');
const { ROLE } = require('../constants/auth.constants');
const adminController = require('../admin/admin.controller');
const validations = require('../middlewares/admin.middleware');
const rateLimit = require('../middlewares/rateLimit.middleware');
const userValidation = require('../middlewares/user_middleware');
const cache = require("../middlewares/cache.middleware");


router.get('/admin/dashboard/stats', isAuthenticated, authorizeRole(ROLE.ADMIN), cache(() => "CACHE:admin:dashboard:stats", 60), adminController.getDashBoardStats);

router.get('/admin/me', isAuthenticated, authorizeRole(ROLE.ADMIN), adminController.getCurrentMe);

router.get('/admin/users', isAuthenticated, authorizeRole(ROLE.ADMIN), rateLimit({
    windowSeconds: Number(process.env.ADMIN_RATE_WINDOW),
    maxRequests: Number(process.env.ADMIN_RATE_RATE),
    keyPrefix: 'admin-users'
}), adminController.getAllUsers);

router.get('/users/by-name/:name', authorizeRole(ROLE.ADMIN), isAuthenticated, userValidation.validateName, adminController.getUserByName);


router.get('/admin/wallet/summary', isAuthenticated, authorizeRole(ROLE.ADMIN), rateLimit({
    windowSeconds: 60,
    maxRequests: 50,
    keyPrefix: 'admin-wallet'
}), validations.validWalletSummaryByDate,
    cache((req) => {
        const date = req.query.date || "all";
        return `CACHE:admin:wallet:summary:${date}`;
    }, 60),
    adminController.getWalletSummary);

router.get('/admin/wallet/summary/range', isAuthenticated, authorizeRole(ROLE.ADMIN), rateLimit({
    windowSeconds: 60,
    maxRequests: 50,
    keyPrefix: 'admin-wallet-range'
}), validations.valdateRange,
    cache((req) => {
        const { start, end, page = 1, limit = 10 } = req.query;
        return `CACHE:admin:wallet:range:${start}:${end}:${page}:${limit}`;
    }, 60),
    adminController.getWalletSummaryInRange);

router.get('/admin/users/:id', isAuthenticated, authorizeRole(ROLE.ADMIN), rateLimit({
    windowSeconds: 60,
    maxRequests: 50,
    keyPrefix: 'admin-users-id'
}), validations.validateObjectId, adminController.getUserById);

router.get('/admin/users/:id/wallet', isAuthenticated, authorizeRole(ROLE.ADMIN), rateLimit({
    windowSeconds: 60,
    maxRequests: 50,
    keyPrefix: 'admin-id-wallet'
}), validations.validateObjectId, adminController.getUserWallet);

router.patch('/admin/users/:id/status', isAuthenticated, authorizeRole(ROLE.ADMIN), rateLimit({
    windowSeconds: 60,
    maxRequests: 50,
    keyPrefix: 'admin-users-status'
}), validations.validateObjectId, validations.validStatusUpdate, adminController.updateUserStatus);

router.patch('/admin/users/:id/wallet', isAuthenticated, authorizeRole(ROLE.ADMIN), rateLimit({
    windowSeconds: 60,
    maxRequests: 50,
    keyPrefix: 'admin-id-walletPatch'
}), validations.validateObjectId, validations.validAdjustBalance, adminController.adjustWalletBalance)


module.exports = router;