const express = require('express');
const router = express.Router();
const auditController = require('./audit.controller');
const isAuthenticated = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/authorizeRole');
const {ROLE} = require('../constants/auth.constants');


router.get('/audit-logs', isAuthenticated, authorizeRole(ROLE.ADMIN), auditController.getAuditLogs);

module.exports = router;