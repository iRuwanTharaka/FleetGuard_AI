const request = require('supertest');

// Load app after mocks
const app = require('../app');

describe('Health Check', () => {
  it('GET /api/health returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', service: 'FleetGuard API' });
    expect(res.body.version).toBeDefined();
  });
});
