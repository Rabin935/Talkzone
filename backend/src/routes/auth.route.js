const express = require('express');
const { 
    checkAuth, 
    login, 
    logout, 
    signup, 
    updateProfile 
} = require('../controllers/auth.controller'); 
const protectRoute = require('../middleware/auth.middleware'); // Correct the import

const router = express.Router();

// Authentication Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protectRoute, updateProfile); // Protected route
router.get('/check', protectRoute, checkAuth);

module.exports = router;