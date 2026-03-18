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

const managerToken = () =>
  jwt.sign(
    { id: 2, email: 'manager@test.com', role: 'manager' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

describe('Inspections API', () => {
  describe('GET /api/inspections/my', () => {
    it('returns driver inspections', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            number_plate: 'CAB-1234',
            make: 'Toyota',
            model: 'Prius',
            health_score: 85,
            customer_name: 'John Doe',
            created_at: new Date(),
            damage_count: 2,
            vehicle_photo_url: null,
          },
        ],
      });

      const res = await request(app)
        .get('/api/inspections/my?page=1')
        .set('Authorization', `Bearer ${driverToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.inspections).toHaveLength(1);
      expect(res.body.inspections[0].number_plate).toBe('CAB-1234');
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/inspections/my');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/inspections (manager)', () => {
    it('returns inspections list for manager', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            number_plate: 'CAB-1234',
            make: 'Toyota',
            driver_name: 'Driver One',
            status: 'completed',
          },
        ],
      });

      const res = await request(app)
        .get('/api/inspections')
        .set('Authorization', `Bearer ${managerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.inspections).toHaveLength(1);
    });
  });
});
