const io = require("socket.io-client");

let socket;

const initializeSocket = (authUser) => {
  if (!authUser || !authUser.id) {
    console.error("authUser is not defined or does not have an id");
    return;
  }

  socket = io("http://localhost:3000", {
    query: {
      userId: authUser.id, // Ensure authUser.id is available
    },
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("newMessage", (message) => {
    console.log("New message received:", message);
    // Handle the new message
  });

  socket.on("getOnlineUsers", (onlineUsers) => {
    console.log("Online users:", onlineUsers);
    // Handle the list of online users
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });
};

module.exports = { initializeSocket, socket };