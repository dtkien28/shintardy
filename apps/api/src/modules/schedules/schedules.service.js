const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SchedulesService {
  async getSchedules(userId) {
    return await prisma.classSchedule.findMany({
      where: { user_id: userId },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' }
      ]
    });
  }

  async createSchedule(userId, data) {
    const { subject_name, day_of_week, start_time, end_time, location, note } = data;
    
    return await prisma.classSchedule.create({
      data: {
        user_id: userId,
        subject_name,
        day_of_week,
        start_time,
        end_time,
        location,
        note
      }
    });
  }

  async updateSchedule(userId, scheduleId, data) {
    // Verify ownership
    const schedule = await prisma.classSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule || schedule.user_id !== userId) {
      throw { code: 'NOT_FOUND', message: 'Lịch học không tồn tại hoặc không có quyền truy cập' };
    }

    return await prisma.classSchedule.update({
      where: { id: scheduleId },
      data
    });
  }

  async deleteSchedule(userId, scheduleId) {
    const schedule = await prisma.classSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule || schedule.user_id !== userId) {
      throw { code: 'NOT_FOUND', message: 'Lịch học không tồn tại hoặc không có quyền truy cập' };
    }

    await prisma.classSchedule.delete({ where: { id: scheduleId } });
    return { success: true };
  }
}

module.exports = new SchedulesService();
