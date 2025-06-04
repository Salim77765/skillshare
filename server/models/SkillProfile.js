const mongoose = require('mongoose');

const skillProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  skills: [{
    type: String,
    required: [true, 'Please add at least one skill']
  }],
  experienceLevel: {
    type: String,
    required: [true, 'Please select an experience level']
  },
  teachingMethods: [{
    type: String,
    required: [true, 'Please select at least one teaching method']
  }],
  availability: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
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
  }],
  profilePicture: {
    type: String,
    default: '/uploads/profile-pictures/default.png'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillProfile', skillProfileSchema);
