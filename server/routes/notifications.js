const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Get notifications for current user
router.get('/', auth, notificationController.getNotifications);

// Get single notification
router.get('/:notificationId', auth, notificationController.getNotification);

// Mark notification as read
router.put('/:notificationId/read', auth, notificationController.markAsRead);

// Delete notification
router.delete('/:notificationId', auth, notificationController.deleteNotification);

module.exports = router;
