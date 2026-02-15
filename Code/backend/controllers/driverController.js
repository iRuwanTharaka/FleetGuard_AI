import jwt from 'jsonwebtoken';
import Driver from '../models/Driver.js';

/**
 * Generate JWT token
 * @param {string} id - Driver ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id, role: 'driver' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * Register a new driver
 * @route POST /api/driver/register
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, licenseNumber } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide name, email, and password',
            });
        }

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({
                status: 'error',
                message: 'Driver with this email already exists',
            });
        }

        // Create new driver
        const driver = await Driver.create({
            name,
            email,
            password,
            phone,
            licenseNumber,
        });

        // Generate token
        const token = generateToken(driver._id);

        res.status(201).json({
            status: 'success',
            message: 'Driver registered successfully',
            data: {
                driver: {
                    id: driver._id,
                    name: driver.name,
                    email: driver.email,
                    phone: driver.phone,
                    licenseNumber: driver.licenseNumber,
                    role: driver.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Driver registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register driver',
            error: error.message,
        });
    }
};

/**
 * Login driver
 * @route POST /api/driver/login
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

        // Find driver and include password field
        const driver = await Driver.findOne({ email }).select('+password');
        if (!driver) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // Check if driver is active
        if (!driver.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is deactivated. Please contact support.',
            });
        }

        // Verify password
        const isPasswordValid = await driver.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // Generate token
        const token = generateToken(driver._id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                driver: {
                    id: driver._id,
                    name: driver.name,
                    email: driver.email,
                    phone: driver.phone,
                    licenseNumber: driver.licenseNumber,
                    role: driver.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Driver login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to login',
            error: error.message,
        });
    }
};

/**
 * Get driver profile
 * @route GET /api/driver/profile
 */
export const getProfile = async (req, res) => {
    try {
        const driver = await Driver.findById(req.user.id);

        if (!driver) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                driver: {
                    id: driver._id,
                    name: driver.name,
                    email: driver.email,
                    phone: driver.phone,
                    licenseNumber: driver.licenseNumber,
                    role: driver.role,
                    isActive: driver.isActive,
                    createdAt: driver.createdAt,
                },
            },
        });
    } catch (error) {
        console.error('Get driver profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get profile',
            error: error.message,
        });
    }
};
