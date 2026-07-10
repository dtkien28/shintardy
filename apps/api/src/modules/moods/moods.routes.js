const express = require('express');
const router = express.Router();
const moodController = require('./moods.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/', protect, moodController.createMoodCheckin);
router.get('/recent', protect, moodController.getRecentMoods);

module.exports = router;
