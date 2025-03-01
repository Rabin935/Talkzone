const { generateToken } = require('../lib/utils');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const cloudinary = require('../lib/cloudinary');

const signup = async (req, res) => {
  console.log('Request Body:', req.body);
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token and respond
    if (newUser) {
      generateToken(newUser.id, res);
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in signup controller', error); // Log the entire error
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token and respond
    generateToken(user.id, res);
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error in login controller', error); // Log the entire error
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    // Upload profile picture to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const [updatedUser] = await User.update(
      { profilePic: uploadResponse.secure_url },
      { where: { id: userId }, returning: true }
    );

    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.log('Error in update profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in checkAuth controller', error); // Log the entire error
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { signup, login, logout, updateProfile, checkAuth };