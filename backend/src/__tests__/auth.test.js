const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const pool = require('../config/database');
const mockQuery = pool.query;

beforeEach(() => {
  mockQuery.mockReset();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new driver successfully', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // email check
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: 'Test Driver', email: 'driver@test.com', role: 'driver', created_at: new Date() }],
        })
        .mockResolvedValueOnce({ rows: [] }); // insert drivers

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Driver',
          email: 'driver@test.com',
          password: 'Password123!',
          role: 'driver',
          phone: '+94771234567',
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toMatchObject({ name: 'Test Driver', email: 'driver@test.com', role: 'driver' });
    });

    it('registers a new manager successfully', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ id: 2, name: 'Test Manager', email: 'manager@test.com', role: 'manager', created_at: new Date() }],
        })
        .mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Manager',
          email: 'manager@test.com',
          password: 'Password123!',
          role: 'manager',
        });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('manager');
    });

    it('returns 409 when email already exists', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'existing@test.com',
          password: 'Password123!',
          role: 'driver',
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already registered');
    });

    it('returns 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: 'Password123!',
          role: 'driver',
        });

      expect(res.status).toBe(400);
    });

    it('returns 400 for short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'test@test.com',
          password: 'short',
          role: 'driver',
        });

      expect(res.status).toBe(400);
    });

    it('returns 400 for invalid role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'test@test.com',
          password: 'Password123!',
          role: 'admin',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in successfully with valid credentials', async () => {
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('Password123!', 12);
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'Test User',
            email: 'user@test.com',
            password_hash: hash,
            role: 'driver',
            is_active: true,
          },
        ],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com', password: 'Password123!' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('user@test.com');
      expect(res.body.user.password_hash).toBeUndefined();
    });

    it('returns 401 for invalid credentials', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid');
    });

    it('returns 401 for wrong password', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            email: 'user@test.com',
            password_hash: 'somehash',
            role: 'driver',
            is_active: true,
          },
        ],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com', password: 'WrongPassword123!' });

      expect(res.status).toBe(401);
    });

    it('returns 400 for missing email', async () => {
      const res = await request(app).post('/api/auth/login').send({ password: 'Password123!' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });

    it('returns user when valid token provided', async () => {
      const token = jwt.sign(
        { id: 1, email: 'user@test.com', role: 'driver' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'Test User',
            email: 'user@test.com',
            role: 'driver',
            avatar_url: null,
            created_at: new Date(),
            phone: null,
            license_number: null,
          },
        ],
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('user@test.com');
    });
  });
});
