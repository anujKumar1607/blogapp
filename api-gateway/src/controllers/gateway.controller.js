const httpService = require('../services/http.service');

exports.registerUser = async (req, res, next) => {
  console.log(`${process.env.USER_SERVICE_URL}/auth/register`)
  try {
    const response = await httpService.post(
      `${process.env.USER_SERVICE_URL}/auth/register`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
    console.log("hello", `${process.env.USER_SERVICE_URL}/auth/login`);
  try {
    const response = await httpService.post(
      `${process.env.USER_SERVICE_URL}/auth/login`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const response = await httpService.get(
      `${process.env.USER_SERVICE_URL}/users`,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const response = await httpService.get(
      `${process.env.USER_SERVICE_URL}/users/${req.params.id}`,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.checkHealth = async (req, res, next) => {
  console.log(`${process.env.USER_SERVICE_URL}/health`)
  try {
    const response = await httpService.get(
      `${process.env.USER_SERVICE_URL}/health`
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};