const habitService = require('./habits.service');

exports.logHabit = async (req, res) => {
  try {
    const result = await habitService.logHabit(req.user.id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

exports.getTodayHabits = async (req, res) => {
  try {
    const habits = await habitService.getTodayHabits(req.user.id);
    res.json({ success: true, data: habits });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
