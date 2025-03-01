const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

const app = express();
const server = http.createServer(app);

// Cloudinary configuration
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

// Your routes and middleware here

const PORT = process.env.PORT || 3000;

// Start the server with error handling
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