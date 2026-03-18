const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

describe('Auth Middleware', () => {
  describe('verifyToken', () => {
    it('calls next when valid token', (done) => {
      const token = jwt.sign(
        { id: 1, email: 'test@test.com', role: 'driver' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = {};
      const next = jest.fn(() => {
        expect(req.user).toMatchObject({ id: 1, email: 'test@test.com', role: 'driver' });
        done();
      });
      verifyToken(req, res, next);
    });

    it('returns 401 when no token', () => {
      const req = { headers: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when invalid token', () => {
      const req = { headers: { authorization: 'Bearer invalid' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('calls next when user has required role', () => {
      const middleware = requireRole('manager', 'admin');
      const req = { user: { role: 'manager' } };
      const res = {};
      const next = jest.fn();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns 403 when user lacks role', () => {
      const middleware = requireRole('manager');
      const req = { user: { role: 'driver' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when no user', () => {
      const middleware = requireRole('manager');
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
