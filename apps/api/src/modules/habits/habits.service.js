const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.logHabit = async (userId, data) => {
  return await prisma.habitLog.create({
    data: {
      ...data,
      user_id: userId
    }
  });
};

exports.getTodayHabits = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await prisma.habitLog.findMany({
    where: {
      user_id: userId,
      logged_at: { gte: today }
    }
  });

  // Group by habit_type and sum values
  const summary = logs.reduce((acc, log) => {
    acc[log.habit_type] = (acc[log.habit_type] || 0) + log.value;
    return acc;
  }, {});

  return summary;
};
