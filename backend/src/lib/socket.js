import { Server } from "socket.io";

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });

    socket.on("getOnlineUsers", () => {
      // Implement your logic to get online users here
      socket.emit("getOnlineUsers", []);
    });
  });
};

const getReceiverSocketId = (userId) => {
  const sockets = io.sockets.sockets;
  for (const [socketId, socket] of sockets) {
    if (socket.handshake.query.userId === userId) {
      return socketId;
    }
  }
  return null;
};

export { setupSocket, io, getReceiverSocketId };
