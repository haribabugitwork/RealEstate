// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  console.log('🔍 Authentication middleware called');
  console.log('🔍 Environment check:');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET);
  console.log('- JWT_SECRET length:', process.env.JWT_SECRET?.length);
  console.log('- Expected secret:', 'your_jwt_secret');
  console.log('- Secrets match:', process.env.JWT_SECRET === 'your_jwt_secret');
  
  const header = req.headers.authorization;
  console.log('🔍 Authorization header:', header);
  
  if (!header) {
    console.log('❌ No authorization header');
    return res.status(401).json({ error: 'No token' });
  }
  
  const token = header.split(' ')[1];
  console.log('🔍 Extracted token:', token);
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully:', payload);
    req.user = payload;
    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    console.error('❌ Full error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...allowedRoles) => (req, res, next) => {
  console.log('🔍 Authorization middleware called');
  console.log('🔍 User:', req.user);
  console.log('🔍 User role:', req.user?.role);
  console.log('🔍 Allowed roles:', allowedRoles);
  
  if (!req.user || !req.user.role) {
    console.log('❌ No user or role found');
    return res.status(403).json({ error: 'Forbidden: No user role' });
  }
  
  if (!allowedRoles.includes(req.user.role)) {
    console.log('❌ User role not allowed');
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }
  
  console.log('✅ Authorization passed');
  next();
};