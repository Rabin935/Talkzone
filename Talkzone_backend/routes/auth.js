const express = require('express');
const router = express.Router();
const { checkAuth, refreshToken } = require('../controllers/authController');
const protectRoute = require('../middleware/authMiddleware');

// ...existing code...

router.get('/check', protectRoute, checkAuth);
router.post('/refresh-token', refreshToken);

// ...existing code...

module.exports = router;
