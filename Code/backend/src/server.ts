/**
 * Company: KITH travels
 * Product: Fleet guard
 * Description: Main server application and entry point.
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';

// Load environment variables
dotenv.config();

// Import routes
import managerRoutes from './routes/managerRoutes';
import driverRoutes from './routes/driverRoutes';
import adminRoutes from './routes/adminRoutes';

// Initialize express app
const app = express();

// Security Middleware
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/manager', managerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Fleet guard Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

// Database connection & Server start
sequelize.sync({ alter: true }) // Sync models with database schema
    .then(() => {
        console.log('✅ Database connected and synced successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((err: Error) => {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('❌ Unhandled Rejection:', err.message);
    process.exit(1);
});
