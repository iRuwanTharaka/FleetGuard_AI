const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const pool = require('../config/database');
const mockQuery = pool.query;

beforeEach(() => {
  mockQuery.mockReset();
});

function getToken() {
  return jwt.sign(
    { id: 1, email: 'user@test.com', role: 'driver' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

describe('User Preferences API', () => {
  describe('GET /api/user/preferences', () => {
    it('returns user preferences', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, user_id: 1, language: 'en', date_format: 'DD/MM/YYYY' }],
      });

      const res = await request(app)
        .get('/api/user/preferences')
        .set('Authorization', `Bearer ${getToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('PUT /api/user/preferences', () => {
    it('updates preferences', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/user/preferences')
        .set('Authorization', `Bearer ${getToken()}`)
        .send({ language: 'si', date_format: 'DD/MM/YYYY' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
