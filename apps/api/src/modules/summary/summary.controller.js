const summaryService = require('./summary.service');

exports.getWeeklySummary = async (req, res) => {
  try {
    const summary = await summaryService.getWeeklySummary(req.user.id);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
