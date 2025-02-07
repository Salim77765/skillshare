const mongoose = require('mongoose');

const skillProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    experienceLevel: {
        type: String,
        required: true
    },
    teachingMethods: [{
        type: String
    }],
    availability: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        default: false
    },
    portfolio: {
        type: String
    },
    certificates: [{
        type: String
    }],
    languages: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('SkillProfile', skillProfileSchema);
