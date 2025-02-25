const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protectRoute = async (req, res, next) => {
  try {
    // Log incoming cookies for debugging
    console.log('Cookies:', req.cookies);

    // Get the token from cookies
    const token = req.cookies.jwt;

    // Check if token is provided
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is valid
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }

    // Find the user associated with the token
    const user = await User.findOne({ where: { id: decoded.userId } });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user information to the request
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in protectRoute middleware:', error.message);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized - Token Expired' });
    }

    // Handle other errors
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = protectRoute;