const SkillProfile = require('../models/SkillProfile');
const User = require('../models/User');

exports.createSkillProfile = async (req, res) => {
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
};

exports.getProfile = async (req, res) => {
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
};

exports.searchProfiles = async (req, res) => {
    try {
        const { query, country, state, city, category, experienceLevel, teachingMethod } = req.query;
        
        // Build search criteria
        let searchCriteria = {};
        
        if (query) {
            searchCriteria.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { skills: { $in: [new RegExp(query, 'i')] } }
            ];
        }
        
        if (country) {
            searchCriteria.country = { $regex: country, $options: 'i' };
        }
        
        if (state) {
            searchCriteria.state = { $regex: state, $options: 'i' };
        }

        if (city) {
            searchCriteria.city = { $regex: city, $options: 'i' };
        }
        
        if (category) {
            searchCriteria.category = category;
        }

        if (experienceLevel) {
            searchCriteria.experienceLevel = experienceLevel;
        }

        if (teachingMethod) {
            searchCriteria.teachingMethods = teachingMethod;
        }

        const profiles = await SkillProfile.find(searchCriteria)
            .populate('user', 'name email')
            .limit(20);

        res.json({
            success: true,
            data: profiles
        });
    } catch (error) {
        console.error('Error in searchProfiles:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error searching profiles',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

exports.getLocations = async (req, res) => {
  try {
    const { type, country } = req.params;

    if (type === 'countries') {
      // Get unique countries
      const countries = await SkillProfile.distinct('country');
      return res.json({
        success: true,
        data: countries.filter(Boolean).sort() // Remove null/empty values and sort
      });
    } else if (type === 'states' && country) {
      // Get states for a specific country
      const states = await SkillProfile.distinct('state', { country });
      return res.json({
        success: true,
        data: states.filter(Boolean).sort() // Remove null/empty values and sort
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid location type requested'
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching locations',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
