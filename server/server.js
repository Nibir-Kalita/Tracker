const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint for uptime monitoring (e.g. UptimeRobot, Render, Railway)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Connect once per serverless instance. Vercel invokes the exported handler;
// local and container deployments still start a normal HTTP server.
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-tracker';

const databaseReady = mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  });

if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    try {
      await databaseReady;
      return app(req, res);
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      return res.status(503).json({ message: 'Database connection unavailable' });
    }
  };
} else {
  databaseReady.then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
}
