const authService = require('./auth.service');

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error.code) {
        return res.status(400).json({ error });
      }
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({ data: result });
    } catch (error) {
      if (error.code === 'USER_NOT_FOUND' || error.code === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error });
      }
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async getMe(req, res) {
    try {
      const user = await authService.getMe(req.userId);
      res.status(200).json({ data: user });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async updateMe(req, res) {
    try {
      const user = await authService.updateMe(req.userId, req.body);
      res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async changePassword(req, res) {
    try {
      await authService.changePassword(req.userId, req.body);
      res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      if (error.code) return res.status(400).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }
}

module.exports = new AuthController();
