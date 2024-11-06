const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      header: jest.fn()
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should validate valid JWT token', () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com' }, process.env.JWT_SECRET || 'your_jwt_secret');
    mockReq.header.mockReturnValue(`Bearer ${token}`);

    auth(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.id).toBe(1);
  });

  it('should reject requests without token', () => {
    mockReq.header.mockReturnValue(null);

    auth(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token manquant' });
  });

  it('should reject invalid token', () => {
    mockReq.header.mockReturnValue('Bearer invalid_token');

    auth(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token invalide' });
  });
});