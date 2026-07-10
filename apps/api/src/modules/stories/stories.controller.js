const storyService = require('./stories.service');

exports.createStory = async (req, res) => {
  try {
    const data = { ...req.body, created_by: req.user.id };
    // If regular user submitting, force author_type to MEMBER
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      data.author_type = 'MEMBER';
    }
    
    const story = await storyService.createStory(data);
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await storyService.getStories(req.query);
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.getTodayStories = async (req, res) => {
  try {
    const stories = await storyService.getTodayStories();
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const story = await storyService.updateStory(req.params.id, req.body);
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.publishStory = async (req, res) => {
  try {
    const story = await storyService.publishStory(req.params.id);
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.bookmarkStory = async (req, res) => {
  try {
    const bookmark = await storyService.bookmarkStory(req.user.id, req.params.id);
    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await storyService.getUserBookmarks(req.user.id);
    res.json({ success: true, data: bookmarks });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
