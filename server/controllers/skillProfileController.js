const SkillProfile = require('../models/SkillProfile');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Create skill profile
// @route   POST /api/skill-profile
// @access  Private
exports.createSkillProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user already has a profile
    let existingProfile = await SkillProfile.findOne({ user: userId });
    
    if (existingProfile) {
      // Update existing profile with all fields from request body
      Object.assign(existingProfile, req.body);
      await existingProfile.save();
      return res.json({ success: true, data: existingProfile });
    }

    // Create new profile with all fields from request body
    const newProfile = new SkillProfile({
      user: userId,
      ...req.body
    });

    await newProfile.save();

    // Update user's profile reference
    await User.findByIdAndUpdate(userId, {
      skillProfile: newProfile._id
    });

    res.status(201).json({
      success: true,
      data: newProfile
    });
  } catch (error) {
    console.error('Error in createSkillProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating skill profile',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// @desc    Get user's skill profile
// @route   GET /api/skill-profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await SkillProfile.findOne({ user: userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// @desc    Update skill profile
// @route   PUT /api/skill-profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    let skillProfile = await SkillProfile.findOne({ user: req.user.id });

    if (!skillProfile) {
      res.status(404);
      throw new Error('Skill profile not found');
    }

    skillProfile = await SkillProfile.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: skillProfile
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// @desc    Get user stats (e.g., students taught, skills learned)
// @route   GET /api/skill-profile/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Assuming studentsTaught and skillsLearned are fields in the User model
    // If they are in SkillProfile, you'd query that model instead
    res.status(200).json({
      success: true,
      data: {
        studentsCount: user.studentsTaught || 0,
        skillsLearnedCount: user.skillsLearned || 0,
      }
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching stats',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// @desc    Upload profile picture
// @route   POST /api/skill-profile/upload-picture
// @access  Private
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    console.log('File upload details:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Create the URL path for the uploaded file
    const imageUrl = `/uploads/profile-pictures/${req.file.filename}`;
    console.log('Generated image URL:', imageUrl);

    let skillProfile = await SkillProfile.findOne({ user: req.user.id });

    if (!skillProfile) {
      skillProfile = await SkillProfile.create({
        user: req.user.id,
        profilePicture: imageUrl
      });
    } else {
      skillProfile = await SkillProfile.findOneAndUpdate(
        { user: req.user.id },
        { profilePicture: imageUrl },
        { new: true }
      );
    }

    console.log('Updated profile:', skillProfile);

    res.json({
      success: true,
      imageUrl: imageUrl,
      data: skillProfile
    });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading profile picture',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// @desc    Search skill profiles
// @route   GET /api/skill-profile/search
// @access  Private
exports.searchProfiles = asyncHandler(async (req, res) => {
  try {
    const {
      query,
      country,
      state,
      city,
      category,
      experienceLevel,
      teachingMethod,
      page = 1,
      limit = 10
    } = req.query;

    const queryObject = {};

    if (query) {
      queryObject.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    if (country) queryObject.country = country;
    if (state) queryObject.state = state;
    if (city) queryObject.city = city;
    if (category) queryObject.category = category;
    if (experienceLevel) queryObject.experienceLevel = experienceLevel;
    if (teachingMethod) queryObject.teachingMethods = teachingMethod;

    // Exclude the current user's profile from search results
    queryObject.user = { $ne: req.user.id };

    const skip = (page - 1) * limit;

    const profiles = await SkillProfile.find(queryObject)
      .populate('user', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await SkillProfile.countDocuments(queryObject);

    res.json({
      success: true,
      data: profiles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in searchProfiles:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching profiles',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// @desc    Get locations
// @route   GET /api/skill-profile/locations/:type
// @access  Private
exports.getLocations = asyncHandler(async (req, res) => {
  try {
    const { type } = req.params;
    const { country } = req.params;
    
    let locations;
    
    if (type === 'countries') {
      locations = await SkillProfile.distinct('country');
    } else if (type === 'states' && country) {
      locations = await SkillProfile.distinct('state', { country });
    } else if (type === 'cities' && req.query.state) {
      locations = await SkillProfile.distinct('city', { state: req.query.state });
    } else {
      res.status(400);
      throw new Error('Invalid location type or missing parameters');
    }

    res.json({
      success: true,
      data: locations.filter(location => location) // Remove null/empty values
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching locations',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});
