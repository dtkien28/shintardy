const moodService = require('./moods.service');

exports.createMoodCheckin = async (req, res) => {
  try {
    const result = await moodService.createMoodCheckin(req.user.id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.getRecentMoods = async (req, res) => {
  try {
    const moods = await moodService.getRecentMoods(req.user.id);
    res.json({ success: true, data: moods });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
