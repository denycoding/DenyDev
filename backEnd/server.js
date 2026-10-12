const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables BEFORE importing routes
dotenv.config();

// Existing project configuration and models
require("./config/cloudinary");

const Message = require("./models/Message");
const userRoutes = require("./routes/UserRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Initialize Express
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Existing routes

// AI description generation route

app.use(userRoutes); // Keep your existing routes

app.use("/", aiRoutes); // Add this for the URL without /api// Home route

app.get("/", (req, res) => {
  res.send("DenyDev API Running");
});

// Existing Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
      });

      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }

      socket.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Socket message error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Check environment variables without printing secrets
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Not Loaded");
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "Loaded" : "Not Loaded",
);

// Connect to MongoDB and start server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`DenyDev API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();
