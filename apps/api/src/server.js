const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shintardy API is running' });
});

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const schedulesRoutes = require('./modules/schedules/schedules.routes');
const todosRoutes = require('./modules/todos/todos.routes');
const studyRoutes = require('./modules/study/study.routes');
const playlistRoutes = require('./modules/playlists/playlists.routes');
const storyRoutes = require('./modules/stories/stories.routes');
const moodRoutes = require('./modules/moods/moods.routes');
const habitRoutes = require('./modules/habits/habits.routes');
const summaryRoutes = require('./modules/summary/summary.routes');

app.use('/api/auth', authRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/study-sessions', studyRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/summary', summaryRoutes);

// Cron Jobs
const startCronJobs = require('./cron/story-publisher');
startCronJobs();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
