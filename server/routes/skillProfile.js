const express = require('express');
const router = express.Router();
const { createSkillProfile, getProfile, searchProfiles, getLocations } = require('../controllers/skillProfileController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSkillProfile);
router.get('/', protect, getProfile);
router.get('/search', protect, searchProfiles);
router.get('/locations/:type', protect, getLocations);
router.get('/locations/states/:country', protect, getLocations);

module.exports = router;
