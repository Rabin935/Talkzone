const express = require('express');
const protectRoute = require('../middleware/auth.middleware'); 
const { getMessages, getUsersForSidebar, sendMessage } = require('../controllers/message.controller'); // Ensure this path is correct

const router = express.Router();

// Messaging Routes
router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

module.exports = router;