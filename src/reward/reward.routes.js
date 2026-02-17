const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth.middleware');
const rewardController = require('./reward.controller');

router.post('/reward/daily-reward', isAuthenticated, rewardController.claimDailyReward);

module.exports = router;