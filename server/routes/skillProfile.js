const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createSkillProfile, getProfile, searchProfiles, getLocations } = require('../controllers/skillProfileController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pictures')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

router.post('/', protect, upload.single('profilePicture'), createSkillProfile);
router.get('/', protect, getProfile);
router.get('/search', protect, searchProfiles);
router.get('/locations/:type', protect, getLocations);
router.get('/locations/states/:country', protect, getLocations);

module.exports = router;
