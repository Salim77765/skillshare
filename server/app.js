const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const skillProfileRoutes = require('./routes/skillProfile');
const requestRoutes = require('./routes/requests');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');

const app = express();

// CORS configuration
app.use(cors());

// Body parser middleware with strict JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }
  next();
});

// Response logging middleware
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    console.log('Response:', {
      status: res.statusCode,
      data: data
    });
    return originalJson.call(this, data);
  };
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skill-profile', skillProfileRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to SkillShare API',
    endpoints: {
      auth: '/api/auth',
      skillProfile: '/api/skill-profile',
      requests: '/api/requests',
      notifications: '/api/notifications',
      messages: '/api/messages'
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// MongoDB connection test route
app.get('/api/db-test', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ 
      message: 'Database connection is working',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message
    });
  }
});

// Error handling for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err);
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
      error: err.message
    });
  }
  next(err);
});

// General error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      root: '/',
      auth: '/api/auth',
      skillProfile: '/api/skill-profile',
      requests: '/api/requests',
      notifications: '/api/notifications',
      messages: '/api/messages',
      test: '/api/test',
      dbTest: '/api/db-test'
    }
  });
});

const PORT = process.env.PORT || 3001;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test the API at: http://localhost:${PORT}/api/test`);
      console.log(`Test database at: http://localhost:${PORT}/api/db-test`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
