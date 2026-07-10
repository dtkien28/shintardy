const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createStory = async (data) => {
  return await prisma.story.create({
    data: {
      ...data,
      // If author is member, status is PENDING by default
      status: data.author_type === 'MEMBER' ? 'PENDING' : data.status || 'DRAFT'
    }
  });
};

exports.getStories = async (query = {}) => {
  const { status, tier, mood } = query;
  
  const filter = {};
  if (status) filter.status = status;
  if (tier) filter.tier = tier;
  if (mood) filter.mood_tags = { has: mood };

  return await prisma.story.findMany({
    where: filter,
    orderBy: { created_at: 'desc' }
  });
};

exports.getTodayStories = async () => {
  // Logic: Get published stories. For a real app, cron job sets published_at to today.
  // We'll fetch published stories ordered by published_at
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.story.findMany({
    where: {
      status: 'PUBLISHED',
      published_at: {
        gte: today
      }
    },
    orderBy: { published_at: 'desc' },
    take: 10
  });
};

exports.updateStory = async (id, data) => {
  return await prisma.story.update({
    where: { id },
    data
  });
};

exports.publishStory = async (id) => {
  return await prisma.story.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      published_at: new Date()
    }
  });
};

exports.bookmarkStory = async (userId, storyId) => {
  return await prisma.storyBookmark.create({
    data: {
      user_id: userId,
      story_id: storyId
    }
  });
};

exports.getUserBookmarks = async (userId) => {
  return await prisma.storyBookmark.findMany({
    where: { user_id: userId },
    include: {
      story: true
    },
    orderBy: { created_at: 'desc' }
  });
};
