const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, validationResult } = require('express-validator');
const compression = require('compression');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { kv } = require('@vercel/kv');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Vercel KV storage for persistent data
// Users and timer states are stored in Vercel KV

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(morgan('combined'));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://subathon-timer-lk.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes, then start adding delays
  delayMs: () => 500 // Add 500ms delay per request after delayAfter
});

app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication endpoints
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required')
], validateRequest, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Store user in KV
    await kv.set(`user:${email}`, user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in KV
    const user = await kv.get(`user:${email}`);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Timer endpoints
app.get('/api/timer/state', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const timerState = await kv.get(`timer:${userId}`) || {
      isRunning: false,
      startTime: null,
      pausedTime: 0,
      totalTime: 0,
      lastUpdated: new Date().toISOString()
    };

    res.json(timerState);
  } catch (error) {
    console.error('Get timer state error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/timer/start', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date().toISOString();
    
    const timerState = {
      isRunning: true,
      startTime: now,
      pausedTime: 0,
      totalTime: 0,
      lastUpdated: now
    };

    await kv.set(`timer:${userId}`, timerState);
    res.json({ message: 'Timer started', timerState });
  } catch (error) {
    console.error('Start timer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/timer/pause', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentState = await kv.get(`timer:${userId}`);
    
    if (!currentState || !currentState.isRunning) {
      return res.status(400).json({ error: 'Timer is not running' });
    }

    const now = new Date();
    const startTime = new Date(currentState.startTime);
    const elapsed = now - startTime;
    
    const updatedState = {
      ...currentState,
      isRunning: false,
      pausedTime: currentState.pausedTime + elapsed,
      lastUpdated: now.toISOString()
    };

    await kv.set(`timer:${userId}`, updatedState);
    res.json({ message: 'Timer paused', timerState: updatedState });
  } catch (error) {
    console.error('Pause timer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/timer/resume', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentState = await kv.get(`timer:${userId}`);
    
    if (!currentState || currentState.isRunning) {
      return res.status(400).json({ error: 'Timer is already running' });
    }

    const now = new Date().toISOString();
    const updatedState = {
      ...currentState,
      isRunning: true,
      startTime: now,
      lastUpdated: now
    };

    await kv.set(`timer:${userId}`, updatedState);
    res.json({ message: 'Timer resumed', timerState: updatedState });
  } catch (error) {
    console.error('Resume timer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/timer/stop', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentState = await kv.get(`timer:${userId}`);
    
    if (!currentState) {
      return res.status(400).json({ error: 'No timer state found' });
    }

    const now = new Date();
    let totalTime = currentState.pausedTime;
    
    if (currentState.isRunning) {
      const startTime = new Date(currentState.startTime);
      const elapsed = now - startTime;
      totalTime += elapsed;
    }

    const updatedState = {
      isRunning: false,
      startTime: null,
      pausedTime: 0,
      totalTime: totalTime,
      lastUpdated: now.toISOString()
    };

    await kv.set(`timer:${userId}`, updatedState);
    res.json({ message: 'Timer stopped', timerState: updatedState });
  } catch (error) {
    console.error('Stop timer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/timer/add-time', [
  body('minutes').isInt({ min: 1, max: 1440 }).withMessage('Minutes must be between 1 and 1440')
], authenticateToken, validateRequest, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { minutes } = req.body;
    const currentState = await kv.get(`timer:${userId}`) || {
      isRunning: false,
      startTime: null,
      pausedTime: 0,
      totalTime: 0,
      lastUpdated: new Date().toISOString()
    };

    const timeToAdd = minutes * 60 * 1000; // Convert to milliseconds
    const updatedState = {
      ...currentState,
      totalTime: currentState.totalTime + timeToAdd,
      lastUpdated: new Date().toISOString()
    };

    await kv.set(`timer:${userId}`, updatedState);
    res.json({ message: `${minutes} minutes added`, timerState: updatedState });
  } catch (error) {
    console.error('Add time error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile endpoint
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;
    const user = await kv.get(`user:${userEmail}`);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Production mode: Serving static files`);
  } else {
    console.log(`🔧 Development mode: CORS enabled for localhost:3000`);
  }
});

module.exports = app;