# FleetGuard AI Backend

A Node.js/Express backend system for fleet management with separate authentication for Managers and Drivers.

## Features

- ✅ Separate login systems for Managers and Drivers
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ MongoDB integration
- ✅ RESTful API architecture
- ✅ Role-based access control

## Project Structure

```
FleetGuard_AI/
├── server.js                 # Main server file
├── .env                      # Environment variables
├── package.json              # Dependencies
├── models/                   # Database models
│   ├── Manager.js
│   └── Driver.js
├── controllers/              # Business logic
│   ├── managerController.js
│   └── driverController.js
├── routes/                   # API routes
│   ├── managerRoutes.js
│   └── driverRoutes.js
└── middleware/               # Custom middleware
    └── auth.js
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file and add your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleetguard?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Manager Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/manager/register` | Register new manager | No |
| POST | `/api/manager/login` | Manager login | No |
| GET | `/api/manager/profile` | Get manager profile | Yes (Manager) |

### Driver Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/driver/register` | Register new driver | No |
| POST | `/api/driver/login` | Driver login | No |
| GET | `/api/driver/profile` | Get driver profile | Yes (Driver) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |

## API Usage Examples

### Manager Registration

```bash
curl -X POST http://localhost:5000/api/manager/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Manager",
    "email": "manager@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Manager Login

```bash
curl -X POST http://localhost:5000/api/manager/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "password123"
  }'
```

### Driver Registration

```bash
curl -X POST http://localhost:5000/api/driver/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Driver",
    "email": "driver@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "licenseNumber": "DL123456"
  }'
```

### Driver Login

```bash
curl -X POST http://localhost:5000/api/driver/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@example.com",
    "password": "password123"
  }'
```

### Get Profile (Protected Route)

```bash
curl -X GET http://localhost:5000/api/manager/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned upon successful login/registration.

## Security Features

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 7 days (configurable)
- Password fields are excluded from query results by default
- Role-based access control prevents unauthorized access
- Account activation status checking

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **dotenv** - Environment variables

## Next Steps

1. Add your MongoDB Atlas connection string to `.env`
2. Install dependencies with `npm install`
3. Start the server with `npm run dev`
4. Test the endpoints using Postman or curl

## License

ISC