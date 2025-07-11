// services/gateway/app.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

dotenv.config();
const app = express();

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// CORS & preflight
app.use(cors());
app.options('*', cors());

// JSON body parsing - but exclude multipart/form-data
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.startsWith('multipart/form-data')) {
    // Skip JSON parsing for file uploads
    return next();
  }
  express.json()(req, res, next);
});

// Rate limiting (uncomment if needed)
// app.use(rateLimit({ windowMs: 60_000, max: 60 }));

// Request logging middleware
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';

  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);

  // Log body only if it's a JSON-based request
  if (
    contentType.includes('application/json') &&
    req.body &&
    Object.keys(req.body).length > 0
  ) {
    console.log('Body:', JSON.stringify(req.body));
  } else if (contentType.startsWith('multipart/form-data')) {
    console.log('Body: [Multipart form data - not logged]');
  }

  next();
});

// JWT guard
const authenticate = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Env lookups
const AUTH_URL = process.env.AUTH_SERVICE_URL;
const PROPERTY_URL = process.env.PROPERTY_SERVICE_URL;
const ALLOC_URL = process.env.ALLOCATION_SERVICE_URL;
const PAY_URL = process.env.PAYMENTS_SERVICE_URL;
const COMP_URL = process.env.COMPLAINTS_SERVICE_URL;
const COMPANY_URL = process.env.COMPANY_SERVICE_URL;

// Log environment variables
console.log('Environment Variables:');
console.log('AUTH_SERVICE_URL:', AUTH_URL);
console.log('PROPERTY_SERVICE_URL:', PROPERTY_URL);
console.log('ALLOCATION_SERVICE_URL:', ALLOC_URL);
console.log('PAYMENTS_SERVICE_URL:', PAY_URL);
console.log('COMPLAINTS_SERVICE_URL:', COMP_URL);
console.log('COMPANY_SERVICE_URL:', COMPANY_URL);

// Enhanced proxy options with file upload support
const createProxyOptions = (target, pathRewrite, routeName) => ({
  target,
  changeOrigin: true,
  pathRewrite,
  logLevel: 'debug',
  timeout: 30000,
  proxyTimeout: 30000,
  followRedirects: false,
  secure: false,
  onError: (err, req, res) => {
    console.error(`[${routeName}] Proxy error:`, err.message);
    console.error(`[${routeName}] Target URL:`, target);
    console.error(`[${routeName}] Request URL:`, req.url);
    console.error(`[${routeName}] Error code:`, err.code);
    if (!res.headersSent) {
      res.status(503).json({ 
        error: 'Service unavailable', 
        details: err.message,
        target: target,
        service: routeName,
        code: err.code
      });
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[${routeName}] Proxying ${req.method} ${req.url} to ${target}${proxyReq.path}`);

    proxyReq.setHeader('Connection', 'keep-alive');
    proxyReq.setHeader('Keep-Alive', 'timeout=30, max=100');

    // Handle different content types properly
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.startsWith('multipart/form-data')) {
      // For file uploads, don't modify the body at all
      // Let the proxy handle the streaming automatically
      console.log(`[${routeName}] Multipart form data detected - letting proxy handle body streaming`);
      return;
    }

    // Handle JSON body for other request types
    if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method) && typeof req.body === 'object') {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${routeName}] Response from ${target}: ${proxyRes.statusCode}`);
    
    // Log response headers for debugging
    console.log(`[${routeName}] Response headers:`, proxyRes.headers);
    
    // Set CORS headers if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
});

// 1) Public auth routes
app.post('/api/auth/register', 
  createProxyMiddleware(createProxyOptions(AUTH_URL, { '^/api/auth/register': '/auth/register' }, 'AUTH_REGISTER'))
);

app.post('/api/auth/login', 
  createProxyMiddleware(createProxyOptions(AUTH_URL, { '^/api/auth/login': '/auth/login' }, 'AUTH_LOGIN'))
);

app.post('/api/auth/refresh', 
  createProxyMiddleware(createProxyOptions(AUTH_URL, { '^/api/auth/refresh': '/auth/refresh' }, 'AUTH_REFRESH'))
);

// 2) Protected auth
app.use('/api/auth',
  authenticate,
  createProxyMiddleware(createProxyOptions(AUTH_URL, { '^/api/auth': '/auth' }, 'AUTH_PROTECTED'))
);

// 3) Property (supports file uploads)
app.use('/api/property',
  authenticate,
  createProxyMiddleware(createProxyOptions(PROPERTY_URL, { '^/api/property': '' }, 'PROPERTY'))
);

// 4) Allocation
app.use('/api/allocation',
  authenticate,
  createProxyMiddleware(createProxyOptions(ALLOC_URL, { '^/api/allocation': '' }, 'ALLOCATION'))
);

// 5) Payments
app.use('/api/payments',
  authenticate,
  createProxyMiddleware(createProxyOptions(PAY_URL, { '^/api/payments': '' }, 'PAYMENTS'))
);

// 6) Complaints
app.use('/api/complaints',
  authenticate,
  createProxyMiddleware(createProxyOptions(COMP_URL, { '^/api/complaints': '' }, 'COMPLAINTS'))
);

// 7) Company
app.use('/api/company',
  authenticate,
  createProxyMiddleware(createProxyOptions(COMPANY_URL, { '^/api/company': '' }, 'COMPANY'))
);

// Error handler
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Gateway error', details: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Available routes:');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/refresh');
  console.log('  * /api/auth/* (protected)');
  console.log('  * /api/property/* (protected) - supports file uploads');
  console.log('  * /api/allocation/* (protected)');
  console.log('  * /api/payments/* (protected)');
  console.log('  * /api/complaints/* (protected)');
  console.log('  * /api/company/* (protected)');
});