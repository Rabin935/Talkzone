const { config } = require('dotenv');
const { connectDB } = require('../lib/db'); 
const User = require('../models/user.model'); 
const Message = require('../models/message.model');

config();

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    username: "EmmaT",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    username: "OliviaM",
    password: "123456",
    profilePic: "https://example.com/image1.jpg",
  },
  {
    email: "sophia.davis@example.com",
    username: "SophiaD",
    password: "123456",
    profilePic: "https://example.com/image2.jpg",
  },
  {
    email: "ava.wilson@example.com",
    username: "AvaW",
    password: "123456",
    profilePic: "https://example.com/image3.jpg",
  },
  {
    email: "isabella.brown@example.com",
    username: "IsabellaB",
    password: "123456",
    profilePic: "https://example.com/image4.jpg",
  },
  {
    email: "mia.johnson@example.com",
    username: "MiaJ",
    password: "123456",
    profilePic: "https://example.com/image5.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    username: "CharlotteW",
    password: "123456",
    profilePic: "https://example.com/image6.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    username: "AmeliaG",
    password: "123456",
    profilePic: "https://example.com/image7.jpg",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    username: "JamesA",
    password: "123456",
    profilePic: "https://example.com/image8.jpg",
  },
  {
    email: "william.clark@example.com",
    username: "WilliamC",
    password: "123456",
    profilePic: "https://example.com/image9.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    username: "BenjaminT",
    password: "123456",
    profilePic: "https://example.com/image10.jpg",
  },
  {
    email: "lucas.moore@example.com",
    username: "LucasM",
    password: "123456",
    profilePic: "https://example.com/image11.jpg",
  },
  {
    email: "henry.jackson@example.com",
    username: "HenryJ",
    password: "123456",
    profilePic: "https://example.com/image12.jpg",
  },
  {
    email: "alexander.martin@example.com",
    username: "AlexanderM",
    password: "123456",
    profilePic: "https://example.com/image13.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    username: "DanielR",
    password: "123456",
    profilePic: "https://example.com/image14.jpg",
  },
];

const seedMessages = [
  {
    senderId: 1, // Use actual user IDs that exist in your User table
    receiverId: 2,
    text: "Hello, how are you?",
    image: null,
  },
  {
    senderId: 2,
    receiverId: 1,
    text: "I'm good, thanks! How about you?",
    image: null,
  },
  // Add more messages as needed
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Sync the User model to create the User table
    await User.sync({ force: true }); // Use { force: true } only in development
    console.log("User table created successfully.");

    // Seed Users
    for (const user of seedUsers) {
      try {
        await User.create(user);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();