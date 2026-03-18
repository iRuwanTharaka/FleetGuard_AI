const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const pool = require('../config/database');
const mockQuery = pool.query;

beforeEach(() => {
  mockQuery.mockReset();
});

const managerToken = () =>
  jwt.sign(
    { id: 1, email: 'manager@test.com', role: 'manager' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

describe('Users API (Manager)', () => {
  describe('GET /api/users/drivers', () => {
    it('returns drivers list for manager', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'Driver One',
            email: 'd1@test.com',
            phone: '+94771111111',
            license_number: 'B123',
            total_inspections: 10,
            today_inspections: 2,
          },
        ],
      });

      const res = await request(app)
        .get('/api/users/drivers')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.drivers).toHaveLength(1);
      expect(res.body.drivers[0].name).toBe('Driver One');
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/users/drivers');
      expect(res.status).toBe(401);
    });

    it('returns 403 for driver role', async () => {
      const driverToken = jwt.sign(
        { id: 2, email: 'driver@test.com', role: 'driver' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const res = await request(app)
        .get('/api/users/drivers')
        .set('Authorization', `Bearer ${driverToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/users/drivers', () => {
    it('creates driver successfully', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ id: 10, name: 'New Driver', email: 'new@test.com', role: 'driver' }],
        })
        .mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/users/drivers')
        .set('Authorization', `Bearer ${managerToken()}`)
        .send({
          name: 'New Driver',
          email: 'new@test.com',
          password: 'Password123!',
          phone: '+94771234567',
          license_number: 'B456',
        });

      expect(res.status).toBe(201);
      expect(res.body.user.name).toBe('New Driver');
    });

    it('returns 400 for short password', async () => {
      const res = await request(app)
        .post('/api/users/drivers')
        .set('Authorization', `Bearer ${managerToken()}`)
        .send({
          name: 'New',
          email: 'new@test.com',
          password: 'short',
        });
      expect(res.status).toBe(400);
    });

    it('returns 409 when email exists', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const res = await request(app)
        .post('/api/users/drivers')
        .set('Authorization', `Bearer ${managerToken()}`)
        .send({
          name: 'New',
          email: 'existing@test.com',
          password: 'Password123!',
        });
      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/users/drivers/:id', () => {
    it('returns driver by id', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'Driver One',
            email: 'd1@test.com',
            phone: '+94771111111',
            license_number: 'B123',
            total_inspections: 10,
            month_inspections: 3,
          },
        ],
      });

      const res = await request(app)
        .get('/api/users/drivers/1')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Driver One');
    });

    it('returns 404 when driver not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get('/api/users/drivers/999')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/users/drivers/:id', () => {
    it('updates driver', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: 'Updated', email: 'd@test.com', phone: '+9477', license_number: 'B999' }],
        });

      const res = await request(app)
        .put('/api/users/drivers/1')
        .set('Authorization', `Bearer ${managerToken()}`)
        .send({ name: 'Updated', phone: '+9477', license_number: 'B999' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated');
    });

    it('returns 404 when driver not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/users/drivers/999')
        .set('Authorization', `Bearer ${managerToken()}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/users/drivers/:id', () => {
    it('soft deletes driver', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete('/api/users/drivers/1')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('removed');
    });

    it('returns 404 when driver not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete('/api/users/drivers/999')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(404);
    });
  });
});
