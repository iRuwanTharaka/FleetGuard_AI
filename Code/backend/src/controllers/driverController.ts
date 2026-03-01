import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';

const generateToken = (id: number) => {
    return jwt.sign({ id, role: UserRole.DRIVER }, process.env.JWT_SECRET || 'KITH_Fleet_Secret', {
        expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
    });
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, phone, licenseNumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide name, email, and password',
            });
        }

        const existingDriver = await User.findOne({ where: { email } });
        if (existingDriver) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email already exists',
            });
        }

        const driver = await User.create({
            name,
            email,
            password,
            phone,
            licenseNumber,
            role: UserRole.DRIVER
        });

        const token = generateToken(driver.id);

        res.status(201).json({
            status: 'success',
            message: 'Driver registered successfully',
            data: {
                driver: driver.toJSON(),
                token,
            },
        });
    } catch (error: any) {
        console.error('Driver registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register driver',
            error: error.message,
        });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password',
            });
        }

        const driver = await User.findOne({ where: { email, role: UserRole.DRIVER } });
        if (!driver) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        if (!driver.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is deactivated. Please contact support.',
            });
        }

        const isPasswordValid = await driver.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(driver.id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                driver: driver.toJSON(),
                token,
            },
        });
    } catch (error: any) {
        console.error('Driver login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to login',
            error: error.message,
        });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const driver = await User.findByPk(req.user.id);

        if (!driver || driver.role !== UserRole.DRIVER) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                driver: driver.toJSON(),
            },
        });
    } catch (error: any) {
        console.error('Get driver profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get profile',
            error: error.message,
        });
    }
};
