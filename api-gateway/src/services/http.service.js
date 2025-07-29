const axios = require('axios');

const instance = axios.create({
  timeout: 5000,
});

// Add request interceptor for logging
instance.interceptors.request.use(
  (config) => {
    console.log(`Making request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(
        `Error response from ${error.config.url}: ${error.response.status}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`No response received from ${error.config.url}`);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

module.exports = {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
};