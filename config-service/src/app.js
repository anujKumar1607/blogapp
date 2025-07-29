const express = require('express');
const app = express();

const serviceMap = {
  userService: {
    url: 'http://user-service:3001',
    health: 'http://user-service:3001/health'
  },
  contentService: {
    url: 'http://content-service:3002',
    health: 'http://content-service:3002/health'
  }
};
// Service Discovery Endpoint
// With health checking
app.get('/services', async (req, res) => {
  const services = {};
  
  for (const [name, config] of Object.entries(serviceMap)) {
    try {
      const healthRes = await fetch(config.health);
      services[name] = {
        ...config,
        status: healthRes.ok ? 'healthy' : 'unhealthy'
      };
    } catch {
      services[name] = {
        ...config,
        status: 'down'
      };
    }
  }

  res.json({
    services,
    lastUpdated: new Date().toISOString()
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use((req, res, next) => {
  const authHeader = req.headers['service-token'];
  if (authHeader === process.env.SHARED_SECRET) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});

module.exports = app;