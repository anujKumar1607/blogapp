const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('Email or username already in use', 400));
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role: req.body.role || 'user'
    });

    // Generate token
    const token = signToken(newUser._id);

    // Remove password from output
    newUser.password = undefined;

    // Make sure to return the response
    return res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
    
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};