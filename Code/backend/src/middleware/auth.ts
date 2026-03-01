import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token;

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

        const secret = process.env.JWT_SECRET || 'KITH_Fleet_Secret';
        const decoded = jwt.verify(token, secret) as any;

        const user = await User.findByPk(decoded.id);

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

        req.user = {
            id: user.id,
            role: user.role,
            email: user.email,
        };

        next();
    } catch (error: any) {
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

        return res.status(500).json({
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
export const restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    };
};
