import jwt from 'jsonwebtoken';
import Manager from '../models/Manager.js';

/**
 * Generate JWT token
 * @param {string} id - Manager ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id, role: 'manager' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * Register a new manager
 * @route POST /api/manager/register
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide name, email, and password',
            });
        }

        // Check if manager already exists
        const existingManager = await Manager.findOne({ email });
        if (existingManager) {
            return res.status(400).json({
                status: 'error',
                message: 'Manager with this email already exists',
            });
        }

        // Create new manager
        const manager = await Manager.create({
            name,
            email,
            password,
            phone,
        });

        // Generate token
        const token = generateToken(manager._id);

        res.status(201).json({
            status: 'success',
            message: 'Manager registered successfully',
            data: {
                manager: {
                    id: manager._id,
                    name: manager.name,
                    email: manager.email,
                    phone: manager.phone,
                    role: manager.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Manager registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register manager',
            error: error.message,
        });
    }
};

/**
 * Login manager
 * @route POST /api/manager/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password',
            });
        }

        // Find manager and include password field
        const manager = await Manager.findOne({ email }).select('+password');
        if (!manager) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // Check if manager is active
        if (!manager.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is deactivated. Please contact support.',
            });
        }

        // Verify password
        const isPasswordValid = await manager.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // Generate token
        const token = generateToken(manager._id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                manager: {
                    id: manager._id,
                    name: manager.name,
                    email: manager.email,
                    phone: manager.phone,
                    role: manager.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Manager login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to login',
            error: error.message,
        });
    }
};

/**
 * Get manager profile
 * @route GET /api/manager/profile
 */
export const getProfile = async (req, res) => {
    try {
        const manager = await Manager.findById(req.user.id);

        if (!manager) {
            return res.status(404).json({
                status: 'error',
                message: 'Manager not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                manager: {
                    id: manager._id,
                    name: manager.name,
                    email: manager.email,
                    phone: manager.phone,
                    role: manager.role,
                    isActive: manager.isActive,
                    createdAt: manager.createdAt,
                },
            },
        });
    } catch (error) {
        console.error('Get manager profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get profile',
            error: error.message,
        });
    }
};
