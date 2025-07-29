const postController = require('../../src/controllers/post.controller');
const Post = require('../../src/models/post.model');
const AppError = require('../../src/utils/appError');

jest.mock("../../src/models/post.model");

describe('Post Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { id: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      req.body = {
        title: 'Test Post',
        content: 'Test content'
      };

      Post.create.mockResolvedValue({
        _id: 'post123',
        title: 'Test Post',
        content: 'Test content',
        author: 'user123'
      });

      await postController.createPost(req, res, next);

      expect(Post.create).toHaveBeenCalledWith({
        title: 'Test Post',
        content: 'Test content',
        author: 'user123'
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});