const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, access denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is valid but user does not exist'
            });
        }

        // Add user info to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).json({
            success: false,
            message: 'Token is invalid',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
