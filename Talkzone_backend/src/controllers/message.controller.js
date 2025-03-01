const User = require('../models/user.model');
const Message = require('../models/message.model');
const cloudinary = require('../lib/cloudinary');
const { getReceiverSocketId, io } = require('../lib/socket');
const { Op } = require('sequelize');

// Get users for sidebar
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await User.findAll({
      where: {
        id: {
          [Op.ne]: loggedInUserId,
        },
      },
      attributes: { exclude: ['password'] },
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error in getUsersForSidebar:', error); 
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get messages between users
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      },
      order: [['createdAt', 'ASC']], // Order messages by timestamp
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller:', error); // Log the full error
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl || null, 
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in sendMessage controller:', error); // Log the full error
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export all functions together
module.exports = { getUsersForSidebar, getMessages, sendMessage };