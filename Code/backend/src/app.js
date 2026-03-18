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
const dashboardRoutes  = require('./routes/dashboard.routes');
const notificationRoutes = require('./routes/notifications.routes');
const errorHandler     = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
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
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);   // MUST be last
module.exports = app;
