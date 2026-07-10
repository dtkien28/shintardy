const express = require('express');
const router = express.Router();
const habitController = require('./habits.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/', protect, habitController.logHabit);
router.get('/today', protect, habitController.getTodayHabits);

module.exports = router;
