const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});

const userSocketMap = {};

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('chatMessage', (message) => {
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('chatMessage', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.send('Server is up and running');
});

const PORT = 3000;
try {
  server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Error starting server:', error);
}

module.exports = { io, app, server, getReceiverSocketId };