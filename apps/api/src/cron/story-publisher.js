const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const startCronJobs = () => {
  // Run everyday at 00:00 (Midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running daily story publisher job...');
    
    try {
      // Find pending or draft stories that should be published today
      // For MVP, we can randomly select 1 LARGE, 1 MEDIUM, and 2 SMALL stories to publish
      
      const tiers = [
        { tier: 'LARGE', count: 1 },
        { tier: 'MEDIUM', count: 1 },
        { tier: 'SMALL', count: 2 }
      ];

      for (const t of tiers) {
        const stories = await prisma.story.findMany({
          where: { tier: t.tier, status: { not: 'PUBLISHED' } },
          take: t.count
        });

        for (const story of stories) {
          await prisma.story.update({
            where: { id: story.id },
            data: {
              status: 'PUBLISHED',
              published_at: new Date()
            }
          });
          console.log(`[CRON] Published ${t.tier} story: ${story.id}`);
        }
      }
      
      console.log('[CRON] Job completed.');
    } catch (error) {
      console.error('[CRON] Job failed:', error);
    }
  });
  
  console.log('[CRON] Story Publisher Job scheduled (Runs at 00:00 daily).');
};

module.exports = startCronJobs;
