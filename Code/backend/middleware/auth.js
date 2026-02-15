import jwt from 'jsonwebtoken';
import Manager from '../models/Manager.js';
import Driver from '../models/Driver.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized. Please login to access this resource.',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user based on role
        let user;
        if (decoded.role === 'manager') {
            user = await Manager.findById(decoded.id);
        } else if (decoded.role === 'driver') {
            user = await Driver.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found. Token is invalid.',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is deactivated.',
            });
        }

        // Attach user to request
        req.user = {
            id: user._id,
            role: decoded.role,
            email: user.email,
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token. Please login again.',
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token expired. Please login again.',
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Authentication failed',
            error: error.message,
        });
    }
};

/**
 * Restrict access to specific roles
 * @param  {...string} roles - Allowed roles
 */
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    };
};
