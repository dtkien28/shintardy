const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getWeeklySummary = async (userId) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get completed todos
  const completedTodos = await prisma.todo.count({
    where: {
      user_id: userId,
      status: 'done',
      updated_at: { gte: oneWeekAgo }
    }
  });

  // Get study time
  const studySessions = await prisma.studySession.findMany({
    where: {
      user_id: userId,
      created_at: { gte: oneWeekAgo }
    }
  });
  
  const totalStudyMinutes = studySessions.reduce((acc, session) => acc + session.duration_minutes, 0);

  // Get a large tier story for encouragement
  const stories = await prisma.story.findMany({
    where: { tier: 'LARGE', status: 'PUBLISHED' },
    take: 5
  });
  
  const encouragement = stories.length > 0 
    ? stories[Math.floor(Math.random() * stories.length)] 
    : null;

  return {
    period: '7 ngày qua',
    stats: {
      completed_todos: completedTodos,
      total_study_minutes: totalStudyMinutes,
      total_study_hours: (totalStudyMinutes / 60).toFixed(1)
    },
    encouragement
  };
};
