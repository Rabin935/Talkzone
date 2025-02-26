const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const authRoutes = require('./routes/auth.route'); 
const cors = require('cors');
const { Server } = require("socket.io"); 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

app.use(cors({credentials: true, origin: ['http://localhost:5174','http://localhost:5173' ] }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/api/auth', authRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle socket events
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Example event for receiving messages
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free it up before starting the server.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});