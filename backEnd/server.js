const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

dotenv.config();

// One or more allowed frontend URLs, separated by commas
const CLIENT_URLS = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

require("./config/cloudinary");

const Message = require("./models/Message");
const User = require("./models/User");
const userRoutes = require("./routes/UserRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Initialize Express
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: CLIENT_URLS }));
app.use(express.json());

// Routes
app.use(userRoutes);
app.use("/", aiRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("DenyDev API Running");
});

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: CLIENT_URLS,
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

// Verify the JWT before allowing a socket connection
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id accountType");

    if (!user || user.accountType === "Blocked") {
      return next(new Error("Unauthorized"));
    }

    socket.userId = user._id.toString();
    next();
  } catch (err) {
    console.error("Socket auth failed:", err.message);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // identity comes from the token, never from the client
  onlineUsers.set(socket.userId, socket.id);

  socket.on("sendMessage", async ({ receiverId, text }) => {
    try {
      if (!receiverId || !text || !text.trim()) return;

      const newMessage = await Message.create({
        senderId: socket.userId,
        receiverId,
        text: text.trim(),
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
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
console.log("CLIENT_URL:", CLIENT_URLS.join(", "));
console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "Loaded" : "Not Loaded",
);

// Connect to MongoDB and start server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "DenyDev" });

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
