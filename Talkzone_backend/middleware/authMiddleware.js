// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Error in protectRoute middleware: JWT expired');
      return res.status(401).json({ message: 'Token has expired' });
    }
    console.error('Error in protectRoute middleware:', error.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protectRoute;