import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  updateUserStatus,
  getUserStatus,
  updateTypingStatus,
  searchMessages,
  addMessageReaction,
  pinMessage,
  getPinnedMessages,
  unpinMessage,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  initiateCall,
  endCall,
  getCallHistory,
  getVideoToken,
  checkIncomingCalls,
} from "../controllers/features.controller.js";

const router = express.Router();

// 🟢 USER STATUS ROUTES
router.post("/status/update", protectRoute, updateUserStatus);
router.get("/status/:userId", protectRoute, getUserStatus);

// ✍️ TYPING STATUS ROUTE
router.post("/typing", protectRoute, updateTypingStatus);

// 🔍 MESSAGE SEARCH ROUTE
router.get("/search", protectRoute, searchMessages);

// 😊 REACTIONS ROUTE
router.post("/reactions/add", protectRoute, addMessageReaction);

// 📌 PINNED MESSAGES ROUTES
router.post("/pin", protectRoute, pinMessage);
router.get("/pinned/:channelId", protectRoute, getPinnedMessages);
router.delete("/pin/:messageId", protectRoute, unpinMessage);

// ⭐ FAVORITES ROUTES
router.post("/favorites/add", protectRoute, addToFavorites);
router.delete("/favorites/:messageId", protectRoute, removeFromFavorites);
router.get("/favorites", protectRoute, getFavorites);

// 🎥 📱 CALL ROUTES
router.post("/calls/initiate", protectRoute, initiateCall);
router.post("/calls/end", protectRoute, endCall);
router.get("/calls/history", protectRoute, getCallHistory);
router.get("/calls/incoming", protectRoute, checkIncomingCalls);
router.get("/video-token", protectRoute, getVideoToken);

export default router;
