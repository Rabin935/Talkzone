const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const authRoutes = require('./routes/auth.route'); 

dotenv.config();

const app = express();
const server = http.createServer(app);


cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use('/api/auth', authRoutes);

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