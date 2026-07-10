const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const storyService = require('../stories/stories.service');

exports.createMoodCheckin = async (userId, data) => {
  const checkin = await prisma.moodCheckin.create({
    data: {
      ...data,
      user_id: userId
    }
  });
  
  // If mood is negative (e.g. 😢, 😠), fetch a small tier story to encourage them
  const negativeMoods = ['😢', '😠', '😔', '😫'];
  let suggestion = null;
  
  if (negativeMoods.includes(data.mood_emoji)) {
    // get a random SMALL tier story.
    const stories = await prisma.story.findMany({
      where: { tier: 'SMALL', status: 'PUBLISHED' },
      take: 5
    });
    
    if (stories.length > 0) {
      suggestion = stories[Math.floor(Math.random() * stories.length)];
    }
  }
  
  return { checkin, suggestion };
};

exports.getRecentMoods = async (userId) => {
  return await prisma.moodCheckin.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 7
  });
};
