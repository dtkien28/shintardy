const schedulesService = require('./schedules.service');

class SchedulesController {
  async getAll(req, res) {
    try {
      const schedules = await schedulesService.getSchedules(req.userId);
      res.status(200).json({ data: schedules });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async create(req, res) {
    try {
      const schedule = await schedulesService.createSchedule(req.userId, req.body);
      res.status(201).json({ data: schedule });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async update(req, res) {
    try {
      const schedule = await schedulesService.updateSchedule(req.userId, req.params.id, req.body);
      res.status(200).json({ data: schedule });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async delete(req, res) {
    try {
      await schedulesService.deleteSchedule(req.userId, req.params.id);
      res.status(200).json({ message: 'Xóa lịch học thành công' });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }
}

module.exports = new SchedulesController();
