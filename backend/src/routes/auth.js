import express from 'express';
import { checkAuth, login, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/check', protectRoute, checkAuth);

router.post('/signup', (req, res) => {
  // Implement your signup logic here
  res.status(201).json({ message: 'Signup successful' });
});

router.post('/login', login);

router.post('/logout', (req, res) => {
  // Implement your logout logic here
  res.status(200).json({ message: 'Logout successful' });
});

router.put('/auth/update-profile', protectRoute, updateProfile);

export default router;
