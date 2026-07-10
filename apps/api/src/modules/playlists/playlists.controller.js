const playlistsService = require('./playlists.service');

class PlaylistsController {
  async getAll(req, res) {
    try {
      const playlists = await playlistsService.getPlaylists(req.userId);
      res.status(200).json({ data: playlists });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async create(req, res) {
    try {
      const playlist = await playlistsService.createPlaylist(req.userId, req.body);
      res.status(201).json({ data: playlist });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async addTrack(req, res) {
    try {
      const track = await playlistsService.addTrack(req.userId, req.params.id, req.body);
      res.status(201).json({ data: track });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async deleteTrack(req, res) {
    try {
      await playlistsService.deleteTrack(req.userId, req.params.trackId);
      res.status(200).json({ message: 'Xóa bài hát thành công' });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }

  async delete(req, res) {
    try {
      await playlistsService.deletePlaylist(req.userId, req.params.id);
      res.status(200).json({ message: 'Xóa playlist thành công' });
    } catch (error) {
      if (error.code) return res.status(404).json({ error });
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
  }
}

module.exports = new PlaylistsController();
