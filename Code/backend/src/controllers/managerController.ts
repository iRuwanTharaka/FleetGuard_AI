import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';

const generateToken = (id: number) => {
    return jwt.sign({ id, role: UserRole.MANAGER }, process.env.JWT_SECRET || 'KITH_Fleet_Secret', {
        expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
    });
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide name, email, and password',
            });
        }

        const existingManager = await User.findOne({ where: { email } });
        if (existingManager) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email already exists',
            });
        }

        const manager = await User.create({
            name,
            email,
            password,
            phone,
            role: UserRole.MANAGER
        });

        const token = generateToken(manager.id);

        res.status(201).json({
            status: 'success',
            message: 'Manager registered successfully',
            data: {
                manager: manager.toJSON(),
                token,
            },
        });
    } catch (error: any) {
        console.error('Manager registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register manager',
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

        const manager = await User.findOne({ where: { email, role: UserRole.MANAGER } });
        if (!manager) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        if (!manager.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is deactivated. Please contact support.',
            });
        }

        const isPasswordValid = await manager.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(manager.id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                manager: manager.toJSON(),
                token,
            },
        });
    } catch (error: any) {
        console.error('Manager login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to login',
            error: error.message,
        });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const manager = await User.findByPk(req.user.id);

        if (!manager || manager.role !== UserRole.MANAGER) {
            return res.status(404).json({
                status: 'error',
                message: 'Manager not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                manager: manager.toJSON(),
            },
        });
    } catch (error: any) {
        console.error('Get manager profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get profile',
            error: error.message,
        });
    }
};
