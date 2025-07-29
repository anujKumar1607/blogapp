const authController = require('../../src/controllers/auth.controller');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

// Mock the User model and jwt
jest.mock('../../src/models/user.model');
jest.mock('jsonwebtoken');

describe('Auth Controller - Register', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(), // This allows chaining .json()
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Mock jwt to return a token
    jwt.sign.mockReturnValue('mocked-token');
  });

  it('should successfully register a new user', async () => {
    // Mock User.findOne to return null (no existing user)
    User.findOne.mockResolvedValue(null);
    
    // Mock User.create to return a user object
    User.create.mockResolvedValue({
      _id: '507f191e810c19729de860ea',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      password: 'hashed-password' // This would be hashed by the pre-save hook
    });

    await authController.register(req, res, next);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      token: 'mocked-token',
      data: {
        user: {
          _id: '507f191e810c19729de860ea',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user'
        }
      }
    });
    
    // Verify User.create was called with expected arguments
    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: expect.any(String), // Since it's hashed
      role: 'user'
    });
  });
});