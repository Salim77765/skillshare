const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const requestController = require('../controllers/requestController');

// Create a new request
router.post('/', auth, requestController.createRequest);

// Get requests for current user
router.get('/', auth, requestController.getRequests);

// Update request status (accept/reject)
router.put('/:requestId/:status', auth, requestController.updateRequestStatus);

// Delete request
router.delete('/:requestId', auth, requestController.deleteRequest);

module.exports = router;
