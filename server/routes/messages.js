const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// Send a message
router.post('/', auth, messageController.sendMessage);

// Get chat history
router.get('/:requestId', auth, messageController.getChatHistory);

module.exports = router;
