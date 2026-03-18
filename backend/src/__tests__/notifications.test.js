const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const pool = require('../config/database');
const mockQuery = pool.query;

beforeEach(() => {
  mockQuery.mockReset();
});

const authToken = () =>
  jwt.sign(
    { id: 1, email: 'user@test.com', role: 'manager' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

describe('Notifications API', () => {
  describe('GET /api/notifications', () => {
    it('returns notifications', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, type: 'inspection', message: 'Inspection completed', is_read: false, created_at: new Date() },
        ],
      });

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.notifications).toBeDefined();
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('marks notification as read', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .patch('/api/notifications/1/read')
        .set('Authorization', `Bearer ${authToken()}`);

      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('marks all as read', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${authToken()}`);

      expect(res.status).toBe(200);
    });
  });
});
