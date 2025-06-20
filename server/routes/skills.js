const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const SkillProfile = require('../models/SkillProfile');

// @desc    Get trending skills
// @route   GET /api/skills/trending
// @access  Private
router.get('/trending', protect, async (req, res) => {
  try {
    // Find the most common skills across all profiles
    // Aggregate and count skills, then sort by count in descending order
    const trendingSkills = await SkillProfile.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, skill: '$_id', count: 1 } }
    ]);

    res.json({
      success: true,
      data: trendingSkills
    });
  } catch (error) {
    console.error('Error fetching trending skills:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching trending skills',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

module.exports = router;