const express = require('express');
const router = express.Router();
const authorizeRole = require('../middlewares/authorizeRole');
const isAuthenticated = require('../middlewares/auth.middleware');
const { ROLE } = require('../constants/auth.constants');
const adminController = require('../admin/admin.controller');

router.get('/admin/users', isAuthenticated, authorizeRole(ROLE.ADMIN), adminController.getAllUsers);
router.get('/admin/users/:id', isAuthenticated, authorizeRole(ROLE.ADMIN), adminController.getUserById);
router.patch('/admin/users/:id/status', isAuthenticated, authorizeRole(ROLE.ADMIN), adminController.updateUserStatus);


module.exports = router;