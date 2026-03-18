const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const pool = require('../config/database');
const mockQuery = pool.query;

beforeEach(() => {
  mockQuery.mockReset();
});

const authToken = (role = 'manager') =>
  jwt.sign(
    { id: 1, email: 'user@test.com', role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

describe('Vehicles API', () => {
  describe('GET /api/vehicles', () => {
    it('returns vehicles list', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            number_plate: 'CAB-1234',
            make: 'Toyota',
            model: 'Prius',
            year: 2020,
            status: 'available',
          },
        ],
      });

      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${authToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles).toHaveLength(1);
      expect(res.body.vehicles[0].number_plate).toBe('CAB-1234');
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/vehicles/available', () => {
    it('returns available vehicles', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, number_plate: 'CAB-1234', make: 'Toyota', model: 'Prius', status: 'available' },
        ],
      });

      const res = await request(app)
        .get('/api/vehicles/available')
        .set('Authorization', `Bearer ${authToken('driver')}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles).toHaveLength(1);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('returns vehicle by id', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            number_plate: 'CAB-1234',
            make: 'Toyota',
            model: 'Prius',
            year: 2020,
          },
        ],
      });

      const res = await request(app)
        .get('/api/vehicles/1')
        .set('Authorization', `Bearer ${authToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.number_plate).toBe('CAB-1234');
    });

    it('returns 404 when vehicle not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get('/api/vehicles/999')
        .set('Authorization', `Bearer ${authToken()}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/vehicles', () => {
    it('creates vehicle', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 5,
            number_plate: 'CAB-5678',
            make: 'Honda',
            model: 'Civic',
            year: 2021,
            vehicle_type: 'car',
          },
        ],
      });

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken()}`)
        .send({
          number_plate: 'cab-5678',
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          vehicle_type: 'car',
        });

      expect(res.status).toBe(201);
      expect(res.body.number_plate).toBe('CAB-5678');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('updates vehicle', async () => {
      mockQuery
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              number_plate: 'CAB-1234',
              make: 'Toyota',
              model: 'Camry',
              year: 2022,
            },
          ],
        });

      const res = await request(app)
        .put('/api/vehicles/1')
        .set('Authorization', `Bearer ${authToken()}`)
        .send({ make: 'Toyota', model: 'Camry', year: 2022 });

      expect(res.status).toBe(200);
      expect(res.body.model).toBe('Camry');
    });
  });
});
