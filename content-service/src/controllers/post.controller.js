const Post = require('../models/post.model');
const Category = require('../models/category.model');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const axios = require('axios');

//const serviceClient = require('../../../shared/utils/serviceclient');
//const UserApiClient = require('../../../shared/services/userApiClient');

exports.getPostWithAuthor = async (req, res, next) => {
  try {
    // Option 1: Direct using serviceClient
    // const userService = await serviceClient.getService('user-service');
    // const author = await axios.get(`${userService.url}/users/${req.params.userId}`);
    
    // Option 2: Using the API client wrapper
    //const author = await UserApiClient.getUserProfile(req.params.userId);

    const post = await Post.findById(req.params.id);
    
    res.json({
      ...post.toObject(),
      author
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const features = new APIFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    
    //const posts = await features.query.populate('author', 'username email');

    //const posts = await Post.find();

    // res.status(200).json({
    //   status: 'success',
    //   results: posts.length,
    //   data: {
    //     posts
    //   }
    // });

    const posts = await features.query.lean(); // Convert to plain JS objects
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        console.log("url",req.headers.authorization,`${process.env.USER_SERVICE_URL}users/${post.author}`)
        const userResponse = await axios.get(
          `${process.env.USER_SERVICE_URL}users/${post.author}`,
          { headers: { Authorization: req.headers.authorization } }
        );
        return { ...post, author: userResponse.data.data };
      })
    );
    res.status(200).json({ status: 'success', data: postsWithAuthors });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username email')
      .populate('categories');

    if (!post) {
      return next(new AppError('No post found with that slug', 404));
    }

    // Increment view count
    post.meta.views += 1;
    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    // Add author from authenticated user
    req.body.author = req.user._id;
    
    const post = await Post.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (err) {
    next(err);
  }
};

// Add updatePost, deletePost, etc. following similar patterns