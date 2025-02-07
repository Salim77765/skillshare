const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');
const SkillProfile = require('../models/SkillProfile');

// Create a new request
exports.createRequest = async (req, res) => {
    try {
        const { mentorId, skillProfileId, message } = req.body;
        const studentId = req.user.id;

        // Check if request already exists
        const existingRequest = await Request.findOne({
            student: studentId,
            mentor: mentorId,
            skillProfile: skillProfileId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'A pending request already exists for this mentor and skill'
            });
        }

        // Create the request
        const request = new Request({
            student: studentId,
            mentor: mentorId,
            skillProfile: skillProfileId,
            message
        });

        await request.save();

        // Create notification for mentor
        const skillProfile = await SkillProfile.findById(skillProfileId);
        const student = await User.findById(studentId);

        const notification = new Notification({
            user: mentorId,
            title: 'New Learning Request',
            message: `${student.name} wants to learn ${skillProfile.title}`,
            type: 'request',
            relatedRequest: request._id
        });

        await notification.save();

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error in createRequest:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating request'
        });
    }
};

// Get requests for current user
exports.getRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, role } = req.query;
        
        let query = {};
        
        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Filter by role (student or mentor)
        if (role === 'student') {
            query.student = userId;
        } else if (role === 'mentor') {
            query.mentor = userId;
        } else {
            // If no role specified, get all requests where user is either student or mentor
            query.$or = [
                { student: userId },
                { mentor: userId }
            ];
        }

        const requests = await Request.find(query)
            .populate('student', 'name email')
            .populate('mentor', 'name email')
            .populate('skillProfile', 'title')
            .sort('-createdAt');

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error in getRequests:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching requests'
        });
    }
};

// Update request status (accept/reject)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.params;
        const userId = req.user.id;

        const request = await Request.findById(requestId)
            .populate('student', 'name')
            .populate('mentor', 'name')
            .populate('skillProfile', 'title');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Verify the current user is the mentor
        if (request.mentor._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this request'
            });
        }

        if (status === 'reject') {
            // Create rejection notification
            const notification = new Notification({
                user: request.student._id,
                title: 'Request Rejected',
                message: `${request.mentor.name} has rejected your request to learn ${request.skillProfile.title}`,
                type: 'rejection',
                relatedRequest: request._id
            });
            await notification.save();

            // Delete the request
            await Request.findByIdAndDelete(requestId);

            return res.json({
                success: true,
                message: 'Request rejected and deleted',
                data: { status: 'rejected' }
            });
        } else if (status === 'accept') {
            request.status = 'accepted';
            await request.save();

            // Create notification for student
            const notification = new Notification({
                user: request.student._id,
                title: 'Request Accepted',
                message: `${request.mentor.name} has accepted your request to learn ${request.skillProfile.title}`,
                type: 'acceptance',
                relatedRequest: request._id
            });
            await notification.save();

            // Create notification for mentor
            const mentorNotification = new Notification({
                user: request.mentor._id,
                title: 'New Student',
                message: `${request.student.name} is now your student for ${request.skillProfile.title}`,
                type: 'system',
                relatedRequest: request._id
            });
            await mentorNotification.save();

            return res.json({
                success: true,
                data: request
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Invalid status provided'
        });
    } catch (error) {
        console.error('Error in updateRequestStatus:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating request status'
        });
    }
};

// Delete request
exports.deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        const request = await Request.findById(requestId)
            .populate('student', 'name')
            .populate('mentor', 'name')
            .populate('skillProfile', 'title');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Delete the request
        await Request.findByIdAndDelete(requestId);

        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteRequest:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting request'
        });
    }
};
