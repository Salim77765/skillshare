const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['request', 'acceptance', 'rejection', 'system'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
