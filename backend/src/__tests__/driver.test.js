const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const pool = require('../config/database');
const mockQuery = pool.query;

beforeEach(() => {
  mockQuery.mockReset();
});

const driverToken = () =>
  jwt.sign(
    { id: 1, email: 'driver@test.com', role: 'driver' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

describe('Driver API', () => {
  describe('GET /api/driver/stats', () => {
    it('returns driver stats', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ c: 50 }] })
        .mockResolvedValueOnce({ rows: [{ c: 12 }] })
        .mockResolvedValueOnce({ rows: [{ c: 2 }] })
        .mockResolvedValueOnce({ rows: [{ avg_health: 85 }] });

      const res = await request(app)
        .get('/api/driver/stats')
        .set('Authorization', `Bearer ${driverToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.total_inspections).toBe(50);
      expect(res.body.month_inspections).toBe(12);
    });

    it('returns 403 for manager', async () => {
      const managerToken = jwt.sign(
        { id: 2, email: 'm@test.com', role: 'manager' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const res = await request(app)
        .get('/api/driver/stats')
        .set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(403);
    });
  });
});
