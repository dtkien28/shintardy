const express = require('express');
const router = express.Router();
const summaryController = require('./summary.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/weekly', protect, summaryController.getWeeklySummary);

module.exports = router;
