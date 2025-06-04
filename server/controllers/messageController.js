const Message = require('../models/Message');
const Request = require('../models/Request');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/documents';
        // Create directory if it doesn't exist
        fs.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow common document types
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only documents are allowed.'));
        }
    }
}).single('document');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        // Handle file upload if present
        if (req.headers['content-type']?.includes('multipart/form-data')) {
            upload(req, res, async function(err) {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }
                await handleMessage(req, res);
            });
        } else {
            await handleMessage(req, res);
        }
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message'
        });
    }
};

// Helper function to handle message creation
async function handleMessage(req, res) {
    try {
        const { requestId, content } = req.body;
        const senderId = req.user.id;

        // Find the request to verify the users are connected
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Verify that the sender is either the student or mentor
        if (request.student.toString() !== senderId && request.mentor.toString() !== senderId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages in this chat'
            });
        }

        // Determine the receiver
        const receiverId = senderId === request.student.toString() ? request.mentor : request.student;

        // Create message object
        const messageData = {
            sender: senderId,
            receiver: receiverId,
            request: requestId,
            content: content || '',
            messageType: 'text'
        };

        // Add attachment if file was uploaded
        if (req.file) {
            messageData.messageType = 'document';
            messageData.attachment = {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: `/uploads/documents/${req.file.filename}`
            };
        }

        const message = new Message(messageData);
        await message.save();

        // Populate sender and receiver details
        await message.populate([
            { path: 'sender', select: 'name email' },
            { path: 'receiver', select: 'name email' }
        ]);

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error in handleMessage:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message'
        });
    }
}

// Get chat history
exports.getChatHistory = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        // Find the request to verify the user is part of the chat
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Verify that the user is either the student or mentor
        if (request.student.toString() !== userId && request.mentor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this chat'
            });
        }

        // Get messages
        const messages = await Message.find({ request: requestId })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            {
                request: requestId,
                receiver: userId,
                read: false
            },
            { read: true }
        );

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error in getChatHistory:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving chat history'
        });
    }
};
