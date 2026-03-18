const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const path       = require('path');

const authRoutes       = require('./routes/auth.routes');
const vehicleRoutes    = require('./routes/vehicles.routes');
const inspectionRoutes = require('./routes/inspections.routes');
const photoRoutes      = require('./routes/photos.routes');
const userRoutes       = require('./routes/users.routes');
const userProfileRoutes = require('./routes/user.routes');
const dashboardRoutes  = require('./routes/dashboard.routes');
const driverRoutes     = require('./routes/driver.routes');
const managerRoutes    = require('./routes/manager.routes');
const notificationRoutes = require('./routes/notifications.routes');
const errorHandler     = require('./middleware/errorHandler');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded photos as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check — hit this first to verify backend is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FleetGuard API', version: '1.0.0' });
});

app.use('/api/auth',        authRoutes);
app.use('/api/vehicles',    vehicleRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/photos',      photoRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/user',        userProfileRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/driver',      driverRoutes);
app.use('/api/manager',     managerRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);   // MUST be last
module.exports = app;
