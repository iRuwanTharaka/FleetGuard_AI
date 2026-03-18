// Mock database before any imports
const mockQuery = jest.fn();
jest.mock('./src/config/database', () => ({
  query: mockQuery,
  on: jest.fn(),
}));

// Mock email service
jest.mock('./src/services/email.service', () => ({
  sendPasswordReset: jest.fn().mockResolvedValue(undefined),
}));

// Set JWT secret for token verification
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jest';

// Export mock for tests to configure
global.mockDbQuery = mockQuery;
