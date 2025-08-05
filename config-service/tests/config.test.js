const request = require('supertest');
const app = require('../src/server');
const { getServiceConfig } = require('../src/services/configService');
const logger = require('../src/utils/logger');

// Mock logger to prevent test logs
jest.mock('../src/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}));

describe('Config Service', () => {
    beforeAll(() => {
        process.env.NODE_ENV = 'test';
    });

    describe('GET /config/public', () => {
        it('should return public configuration', async () => {
            const res = await request(app)
                .get('/config/public');
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty('auth');
            expect(res.body.data).toHaveProperty('services');
        });
    });

    describe('GET /config/services/:serviceName', () => {
        it('should return service config for valid service', async () => {
            const serviceName = 'user-service';
            const res = await request(app)
                .get(`/config/services/${serviceName}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.url).toContain(serviceName);
        });

        it('should return 404 for invalid service', async () => {
            const res = await request(app)
                .get('/config/services/invalid-service');
            
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('Service Config Methods', () => {
        it('getServiceConfig should return valid config', () => {
            const config = getServiceConfig('content-service');
            expect(config).toHaveProperty('url');
            expect(config.url).toContain('content-service');
        });

        it('getServiceConfig should throw for invalid service', () => {
            expect(() => getServiceConfig('nonexistent-service')).toThrow();
        });
    });
});