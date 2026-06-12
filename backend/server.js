const express = require('express');
const cors = require('cors');
const path = require('path');
const executeRoutes = require('./routes/execute');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/execute', executeRoutes);

// Serve frontend static files in production
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Health check (only when not serving frontend)
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Online Compiler API is running!',
    version: '2.0.0',
    supportedLanguages: [
      'javascript', 'python', 'java', 'c', 'cpp',
      'typescript', 'go', 'php', 'ruby'
    ]
  });
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\x1b[32m✓ Online Compiler API running on http://localhost:${PORT}\x1b[0m`);
});

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
});

module.exports = app;
