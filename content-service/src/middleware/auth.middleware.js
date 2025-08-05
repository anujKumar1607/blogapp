const jwt = require('jsonwebtoken');
//const User = require('../../../user-service/src/models/user.model');
const AppError = require('../utils/appError');
const axios = require("axios")

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    //console.log(`${process.env.USER_SERVICE_URL}auth/verify/${decoded.id}`)
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}auth/verify/${decoded.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.status !== 'success') {
      return next(new AppError('User no longer exists', 401));
    }

     req.user = response.data.data;

    // const currentUser = await User.findById(decoded.id);
    // console.log(decoded.id, process.env.JWT_SECRET)
    // if (!currentUser) {
    //   return next(
    //     new AppError('The user belonging to this token no longer exists', 401)
    //   );
    // }

    // 4) Grant access to protected route
    // req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};