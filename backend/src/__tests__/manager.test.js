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

describe('Manager API', () => {
  describe('GET /api/manager/dashboard/stats', () => {
    it('returns dashboard stats', async () => {
      mockQuery
        .mockResolvedValueOnce({
          rows: [{ total_vehicles: 10, available: 7, in_use: 2, maintenance: 1, avg_health_score: 85 }],
        })
        .mockResolvedValueOnce({ rows: [{ c: 5 }] })
        .mockResolvedValueOnce({ rows: [{ c: 2 }] })
        .mockResolvedValueOnce({ rows: [{ c: 1 }] })
        .mockResolvedValueOnce({ rows: [{ c: 5 }] })
        .mockResolvedValueOnce({ rows: [{ c: 25 }] });

      const res = await request(app)
        .get('/api/manager/dashboard/stats')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.total_vehicles).toBe(10);
      expect(res.body.driver_count).toBe(5);
    });

    it('returns 403 for driver', async () => {
      const driverToken = jwt.sign(
        { id: 2, email: 'd@test.com', role: 'driver' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const res = await request(app)
        .get('/api/manager/dashboard/stats')
        .set('Authorization', `Bearer ${driverToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/manager/inspections-summary', () => {
    it('returns inspections summary', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ c: 25 }] })
        .mockResolvedValueOnce({ rows: [{ avg_health: 85 }] })
        .mockResolvedValueOnce({ rows: [{ c: 3 }] });

      const res = await request(app)
        .get('/api/manager/inspections-summary')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.month_count).toBe(25);
    });
  });

  describe('GET /api/manager/analytics/health-trend', () => {
    it('returns health trend data', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { date: '2024-01-01', avg_health: 85 },
          { date: '2024-01-02', avg_health: 87 },
        ],
      });

      const res = await request(app)
        .get('/api/manager/analytics/health-trend?days=7')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(200);
    });
  });
});
