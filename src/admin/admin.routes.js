const express = require('express');
const router = express.Router();
const authorizeRole = require('../middlewares/authorizeRole');
const isAuthenticated = require('../middlewares/auth.middleware');
const { ROLE } = require('../constants/auth.constants');
const adminController = require('../admin/admin.controller');
const validations = require('../middlewares/admin.middleware');

router.get('/admin/users', isAuthenticated, authorizeRole(ROLE.ADMIN), adminController.getAllUsers);
router.get('/admin/wallet/summary', isAuthenticated, authorizeRole(ROLE.ADMIN), validations.validWalletSummaryByDate, adminController.getWalletSummary);
router.get('/admin/wallet/summary/range', isAuthenticated, authorizeRole(ROLE.ADMIN),validations.valdateRange, adminController.getWalletSummaryInRange);
router.get('/admin/users/:id', isAuthenticated, authorizeRole(ROLE.ADMIN), validations.validateObjectId, adminController.getUserById);
router.get('/admin/users/:id/wallet', isAuthenticated, authorizeRole(ROLE.ADMIN), validations.validateObjectId, adminController.getUserWallet);
router.patch('/admin/users/:id/status', isAuthenticated, authorizeRole(ROLE.ADMIN), validations.validateObjectId, validations.validStatusUpdate, adminController.updateUserStatus);
router.patch('/admin/users/:id/wallet', isAuthenticated, authorizeRole(ROLE.ADMIN), validations.validateObjectId, validations.validAdjustBalance, adminController.adjustWalletBalance)


module.exports = router;