import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import featuresRoutes from "./routes/features.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5001", "https://link-up-xi-ten.vercel.app", "https://linkup-web-8vjm.onrender.com", "*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
  transports: ["websocket", "polling"]
});

const PORT = process.env.PORT;
const __dirname = path.resolve();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", 
  "http://localhost:5001",
  "https://linkup-production-6bb4.up.railway.app",
  "https://link-up-xi-ten.vercel.app",
  "https://linkup-web-8vjm.onrender.com",
  "*",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

// Store active users and their socket IDs
const activeUsers = new Map();

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  // User joins with their ID
  socket.on("user_online", (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} is online (socket: ${socket.id})`);
  });

  // Initiate call - send to recipient
  socket.on("call_start", (data) => {
    const { callerId, callerName, calleeId, callType, callData } = data;
    const recipientSocket = activeUsers.get(calleeId);

    console.log(`Call from ${callerId} to ${calleeId}, socket: ${recipientSocket}`);

    if (recipientSocket) {
      io.to(recipientSocket).emit("incoming_call", {
        callerId,
        callerName,
        callType,
        callData
      });
    } else {
      socket.emit("call_failed", { message: "Recipient not online" });
    }
  });

  // Call accepted - send to caller
  socket.on("call_accept", (data) => {
    const { callerId, calleeId, answer } = data;
    const callerSocket = activeUsers.get(callerId);

    console.log(`Call accepted by ${calleeId}, sending to ${callerId}`);

    if (callerSocket) {
      io.to(callerSocket).emit("call_accepted", {
        calleeId,
        answer
      });
    }
  });

  // Call rejected - send to caller
  socket.on("call_reject", (data) => {
    const { callerId, calleeId } = data;
    const callerSocket = activeUsers.get(callerId);

    console.log(`Call rejected by ${calleeId}`);

    if (callerSocket) {
      io.to(callerSocket).emit("call_rejected", { calleeId });
    }
  });

  // WebRTC signaling - exchange ICE candidates and SDP
  socket.on("webrtc_offer", (data) => {
    const { to, offer } = data;
    const recipientSocket = activeUsers.get(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit("webrtc_offer", { offer, from: data.from });
    }
  });

  socket.on("webrtc_answer", (data) => {
    const { to, answer } = data;
    const recipientSocket = activeUsers.get(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit("webrtc_answer", { answer, from: data.from });
    }
  });

  socket.on("webrtc_ice_candidate", (data) => {
    const { to, candidate } = data;
    const recipientSocket = activeUsers.get(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit("webrtc_ice_candidate", { candidate, from: data.from });
    }
  });

  // End call
  socket.on("call_end", (data) => {
    const { callerId, calleeId } = data;
    const otherSocket = activeUsers.get(callerId === calleeId ? calleeId : (callerId ? calleeId : callerId));
    const targetId = calleeId || callerId;
    const targetSocket = activeUsers.get(targetId);

    if (targetSocket) {
      io.to(targetSocket).emit("call_ended", {});
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    for (let [userId, sockId] of activeUsers.entries()) {
      if (sockId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} went offline`);
        break;
      }
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/features", featuresRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
