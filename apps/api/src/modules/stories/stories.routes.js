const express = require('express');
const router = express.Router();
const storyController = require('./stories.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Public/Member routes
router.get('/today', storyController.getTodayStories);
router.get('/', storyController.getStories);
router.post('/submit', protect, storyController.createStory);

// Bookmarks
router.get('/bookmarks/me', protect, storyController.getUserBookmarks);
router.post('/:id/bookmark', protect, storyController.bookmarkStory);

// Admin/Editor routes (should have role checking middleware in a real app)
router.post('/admin', protect, storyController.createStory);
router.patch('/admin/:id', protect, storyController.updateStory);
router.post('/admin/:id/publish', protect, storyController.publishStory);

module.exports = router;
