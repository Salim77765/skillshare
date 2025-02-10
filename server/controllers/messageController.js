const Message = require('../models/Message');
const Request = require('../models/Request');

// Send a message
exports.sendMessage = async (req, res) => {
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

        // Determine the receiver (if sender is student, receiver is mentor and vice versa)
        const receiverId = senderId === request.student.toString() ? request.mentor : request.student;

        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            request: requestId,
            content
        });

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
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sending message'
        });
    }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        // Find the request to verify the users are connected
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

        // Get messages for this request
        const messages = await Message.find({ request: requestId })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort('createdAt');

        // Mark messages as read where the current user is the receiver
        await Message.updateMany(
            { request: requestId, receiver: userId, read: false },
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
            message: error.message || 'Error fetching chat history'
        });
    }
};
