const express = require('express');
const { connectMongoDB, closeMongoDB } = require('./src/config/mongodb');
const authRoutes = require('./src/routes/auth');
const usersRoutes = require('./src/routes/users');
const pushNotificationRoutes = require('./src/routes/pushNotification');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/push-notifications', pushNotificationRoutes);

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

let server;

const startServer = async () => {
  try {
    await connectMongoDB();
    server = app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeMongoDB();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer();
