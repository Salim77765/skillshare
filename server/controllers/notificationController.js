const Notification = require('../models/Notification');

// Get notifications for current user
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const notifications = await Notification.find({ user: userId })
            .populate('relatedRequest')
            .sort('-createdAt')
            .limit(50);

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching notifications'
        });
    }
};

// Get single notification
exports.getNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findById(notificationId)
            .populate({
                path: 'relatedRequest',
                select: '_id student mentor skillProfile status',
                populate: [
                    { path: 'student', select: 'name email' },
                    { path: 'mentor', select: 'name email' },
                    { path: 'skillProfile', select: 'title' }
                ]
            });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Verify the notification belongs to the current user
        if (notification.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this notification'
            });
        }

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error in getNotification:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching notification'
        });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Verify the notification belongs to the current user
        if (notification.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this notification'
            });
        }

        notification.read = true;
        await notification.save();

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error in markAsRead:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error marking notification as read'
        });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Verify the notification belongs to the current user
        if (notification.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this notification'
            });
        }

        await notification.deleteOne();

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteNotification:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting notification'
        });
    }
};
