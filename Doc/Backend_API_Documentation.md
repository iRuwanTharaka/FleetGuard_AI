# Fleet guard Backend Documentation

## Company Details
- **Company:** KITH travels
- **Product:** Fleet guard

## Architecture Overview
The backend is built with **Node.js**, **Express**, and **TypeScript**, using **Sequelize** as the ORM to connect to a **PostgreSQL** database. 

It implements a layered architecture:
- **Routes:** Defines API endpoints and applies middleware for role-based access control.
- **Controllers:** Contains the business logic for each endpoint.
- **Models:** Sequelize ORM entities representing the database tables.
- **Middleware:** Security, authentication (`protect`), and role restrictions (`restrictTo`).

## Security
- `helmet`: Adds security HTTP headers.
- `cors`: Handles Cross-Origin Resource Sharing.
- `express-rate-limit`: Prevents abuse by limiting incoming IP requests.
- **Authentication:** Follows a JWT-based authentication system with hashed passwords using `bcrypt`.

## Database Config
The app uses **PostgreSQL**. The configuration lives in `src/config/database.ts` using `sequelize-typescript` decorators. Models are synchronized upon server start.

---

## API Endpoints

### 1. General Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check endpoint returning the server status. |

### 2. Admin Routes (`/api/admin`)
Requires JWT token and `admin` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/drivers` | Retrieves a list of all drivers. |
| POST | `/api/admin/drivers` | Creates a new driver profile. |
| GET | `/api/admin/drivers/:id` | Retrieves specific driver info. |
| PUT | `/api/admin/drivers/:id` | Updates a specific driver profile. |
| DELETE| `/api/admin/drivers/:id` | Deletes a specific driver profile. |
| GET | `/api/admin/vehicles` | Retrieves a list of all vehicles. |
| POST | `/api/admin/vehicles` | Creates a new vehicle record. |
| GET | `/api/admin/vehicles/:id` | Retrieves specific vehicle details. |
| PUT | `/api/admin/vehicles/:id` | Updates specific vehicle details. |
| DELETE| `/api/admin/vehicles/:id` | Deletes a specific vehicle record. |

### 3. Manager Routes (`/api/manager`)
*(Note: Route definitions are available in `src/routes/managerRoutes.ts`)*

### 4. Driver Routes (`/api/driver`)
*(Note: Route definitions are available in `src/routes/driverRoutes.ts`)*

---

## Environment Variables Needed
- `PORT` - Port on which application runs (default: 5000)
- `NODE_ENV` - Environment (e.g. `development`, `production`)
- `POSTGRES_URI` - Connection string for PostgreSQL database
- `JWT_SECRET` - Secret key used for signing JWT tokens
- `JWT_EXPIRES_IN` - Expiration time for JWT
- `BCRYPT_SALT_ROUNDS` - Salt rounds used by `bcrypt` (default: 10)
