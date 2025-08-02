const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => res.send('Everything is OK'));



// Proxy middleware for user-service
app.use('/', createProxyMiddleware({
    target: 'http://user-service:3001',
    pathRewrite: {
        '^/api/v1': '/api/v1'  // Rewrite /auth to /api/v1/auth
    },
    changeOrigin: true,
    timeout: 5000,  // 5 second timeout
    proxyTimeout: 5000,
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(502).json({ error: 'Bad Gateway' });
    }
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log('Available routes:');
    console.log('POST /auth/register → http://user-service:3001/api/v1/auth/register');
});