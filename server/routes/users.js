const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user data
router.get('/me', auth, async (req, res) => {
  try {
    console.log('GET /me - User ID from token:', req.user.userId);
    
    const user = await User.findById(req.user.userId)
      .select('-password')
      .lean();
    
    if (!user) {
      console.log('User not found for ID:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', { ...user, password: undefined });
    res.json(user);
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Get all developers
router.get('/developers', auth, async (req, res) => {
  try {
    const developers = await User.find({ 
      role: 'developer',
      _id: { $ne: req.user.userId }, // Exclude the current user
      'developerProfile.skills': { $exists: true, $ne: [] }, // Must have skills
      'developerProfile.education': { $exists: true } // Must have education info
    })
    .select('-password -email -__v')
    .lean();

    res.json(developers);
  } catch (error) {
    console.error('Error fetching developers:', error);
    res.status(500).json({ message: 'Error fetching developers' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates through this route
    delete updates.role; // Don't allow role updates through this route

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Add or update skills
router.put('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { skills } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skills' });
  }
});

// Search users by skills
router.get('/search', async (req, res) => {
  try {
    const { skill, location } = req.query;
    let query = {};

    if (skill) {
      query['skills.name'] = new RegExp(skill, 'i');
    }

    if (location) {
      // Add location-based search when coordinates are provided
      // This is a placeholder for the actual implementation
      query['location.address'] = new RegExp(location, 'i');
    }

    const users = await User.find(query)
      .select('firstName lastName skills location contactDetails')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

module.exports = router;
