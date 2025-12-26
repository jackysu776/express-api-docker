const express = require('express');
const { connectMongoDB, closeMongoDB } = require('./src/config/mongodb');
const authRoutes = require('./src/routes/auth');
const usersRoutes = require('./src/routes/users');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Express API is running', version: '1.0.0' });
});

app.use('/api', authRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
  });
});

const PORT = process.env.PORT || 3000;

let server;

const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log('Node environment:', process.env.NODE_ENV || 'development');
    await connectMongoDB();
    console.log('MongoDB connected, starting Express server...');
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`API running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Full error details:', error.stack);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('Server closed');
      await closeMongoDB();
      process.exit(0);
    });
  } else {
    await closeMongoDB();
    process.exit(0);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
