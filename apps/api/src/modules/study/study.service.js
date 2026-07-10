const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class StudyService {
  async getSessions(userId) {
    return await prisma.studySession.findMany({
      where: { user_id: userId },
      orderBy: { started_at: 'desc' }
    });
  }

  async createSession(userId, data) {
    const { mode, duration_minutes, started_at, ended_at } = data;
    
    return await prisma.studySession.create({
      data: {
        user_id: userId,
        mode: mode || 'solo',
        duration_minutes,
        started_at: new Date(started_at),
        ended_at: ended_at ? new Date(ended_at) : null
      }
    });
  }
}

module.exports = new StudyService();
