const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => res.send('Everything is OK'));



// Proxy middleware for user-service
app.use(
  '/api/v1/users',  // Route for user-service
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}/api/v1`, // e.g., http://user-service:3001/api/v1
    changeOrigin: true,
    pathRewrite: { '^/api/v1/users': '' }, // Optional: Remove prefix
  })
);

app.use(
  '/api/v1/content',  // Route for user-service
  createProxyMiddleware({
    target: `${process.env.CONTENT_SERVICE_URL}/api/v1`, // e.g., http://content-service:3001/api/v1
    changeOrigin: true,
    pathRewrite: { '^/api/v1/content': '' }, // Optional: Remove prefix
  })
);
// app.use('/user-service', createProxyMiddleware({
//     target: `${process.env.USER_SERVICE_URL}`,
//     pathRewrite: {
//         '^/api/v1': '/api/v1'  // Rewrite /auth to /api/v1/auth
//     },
//     changeOrigin: true,
//     timeout: 5000,  // 5 second timeout
//     proxyTimeout: 5000,
//     onError: (err, req, res) => {
//         console.error('Proxy error:', err);
//         res.status(502).json({ error: 'Bad Gateway' });
//     }
// }));
// app.use('/content-service', createProxyMiddleware({
//     target: `${process.env.CONTENT_SERVICE_URL}`,
//     pathRewrite: {
//         '^/api/v1': '/api/v1'  // Rewrite /auth to /api/v1/auth
//     },
//     changeOrigin: true,
//     timeout: 5000,  // 5 second timeout
//     proxyTimeout: 5000,
//     onError: (err, req, res) => {
//         console.error('Proxy error:', err);
//         res.status(502).json({ error: 'Bad Gateway' });
//     }
// }));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log('Available routes:');
    console.log(`POST /auth/register → ${process.env.USER_SERVICE_URL}`);
});