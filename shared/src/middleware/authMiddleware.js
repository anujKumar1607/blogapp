const { verifyToken } = require('../utils/auth');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants/httpStatusCode');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED 
    });
  }
};

module.exports = { authenticate };