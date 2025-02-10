const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SkillProfile = require('../models/SkillProfile');
const { protect } = require('../middleware/authMiddleware');

// Debug middleware for this router
router.use((req, res, next) => {
  console.log('\n=== Auth Route Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('=========================\n');

  // Capture the original res.json to add logging
  const originalJson = res.json;
  res.json = function(data) {
    console.log('\n=== Auth Route Response ===');
    console.log('Status:', res.statusCode);
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('=========================\n');
    return originalJson.call(this, data);
  };

  next();
});

// Wrap async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @route   GET /api/auth/test
// @desc    Test auth route
// @access  Public
router.get('/test', (req, res) => {
  console.log('Auth test route hit');
  res.json({ message: 'Auth route is working' });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  console.log('Starting registration process...');
  
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    console.log('Missing required fields:', { name: !name, email: !email, password: !password });
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Check existing user
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    console.log('User already exists:', email);
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  try {
    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });

    await user.save();
    console.log('User saved successfully:', user._id);

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Send response
    const responseData = {
      success: true,
      message: 'Registration successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    };

    console.log('Sending response:', {
      ...responseData,
      data: { ...responseData.data, token: '[HIDDEN]' }
    });

    return res.status(201).json(responseData);
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user has a skill profile
    const skillProfile = await SkillProfile.findOne({ user: user._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
        hasSkillProfile: !!skillProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json({
      success: true,
      message: 'User profile retrieved',
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error getting user profile',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}));

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Auth route error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

module.exports = router;
