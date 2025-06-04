const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createSkillProfile, getProfile, searchProfiles, getLocations, updateProfile, uploadProfilePicture, getStats } = require('../controllers/skillProfileController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'profile-pictures');
    console.log('Upload path:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Get file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueFilename = `${uuidv4()}${ext}`;
    console.log('Generated filename:', uniqueFilename);
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Add logging middleware for file upload route
router.post('/upload-picture', protect, (req, res, next) => {
  console.log('Upload picture request received');
  next();
}, upload.single('profilePicture'), uploadProfilePicture);

router.post('/', protect, createSkillProfile);
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.get('/search', protect, searchProfiles);
router.get('/locations/:type', protect, getLocations);
router.get('/locations/states/:country', protect, getLocations);
router.get('/stats', protect, getStats);

module.exports = router;
