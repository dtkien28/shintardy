const studyService = require('./study.service');

class StudyController {
  async getAll(req, res) {
    try {
      const sessions = await studyService.getSessions(req.userId);
      res.status(200).json({ data: sessions });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async create(req, res) {
    try {
      const session = await studyService.createSession(req.userId, req.body);
      res.status(201).json({ data: session });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }
}

module.exports = new StudyController();
