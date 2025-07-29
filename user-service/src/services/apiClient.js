const serviceClient = require('../../../shared/utils/serviceclient');

class UserApiClient {
  async getUserProfile(userId) {
    return serviceClient.makeServiceRequest('user-service', {
      method: 'GET',
      path: `/api/v1/users/${userId}`,
      timeout: 5000
    });
  }

  async updateUserPreferences(userId, preferences) {
    return serviceClient.makeServiceRequest('user-service', {
      method: 'PATCH',
      path: `/api/v1/users/${userId}/preferences`,
      data: preferences
    });
  }
}

module.exports = new UserApiClient();