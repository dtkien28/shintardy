const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PlaylistsService {
  async getPlaylists(userId) {
    return await prisma.playlist.findMany({
      where: { user_id: userId },
      include: { tracks: true },
      orderBy: { created_at: 'desc' }
    });
  }

  async createPlaylist(userId, data) {
    const { name, mood_tag } = data;
    
    return await prisma.playlist.create({
      data: {
        user_id: userId,
        name,
        mood_tag
      },
      include: { tracks: true }
    });
  }

  async addTrack(userId, playlistId, data) {
    const { title, url, duration } = data;
    
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.user_id !== userId) {
      throw { code: 'NOT_FOUND', message: 'Playlist không tồn tại hoặc không có quyền' };
    }

    return await prisma.playlistTrack.create({
      data: {
        playlist_id: playlistId,
        title,
        url,
        duration
      }
    });
  }

  async deleteTrack(userId, trackId) {
    const track = await prisma.playlistTrack.findUnique({ 
      where: { id: trackId },
      include: { playlist: true }
    });
    
    if (!track || track.playlist.user_id !== userId) {
      throw { code: 'NOT_FOUND', message: 'Bài hát không tồn tại hoặc không có quyền' };
    }

    await prisma.playlistTrack.delete({ where: { id: trackId } });
    return { success: true };
  }

  async deletePlaylist(userId, playlistId) {
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.user_id !== userId) {
      throw { code: 'NOT_FOUND', message: 'Playlist không tồn tại hoặc không có quyền' };
    }

    await prisma.playlist.delete({ where: { id: playlistId } });
    return { success: true };
  }
}

module.exports = new PlaylistsService();
