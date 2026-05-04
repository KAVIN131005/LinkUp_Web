import User from "../models/User.js";
import PinnedMessage from "../models/PinnedMessage.js";
import { generateVideoToken, createVideoCall, getCallDetails } from "../lib/stream.js";

// 🟢 USER ONLINE STATUS MANAGEMENT
export async function updateUserStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["online", "away", "busy", "offline"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        onlineStatus: status,
        lastSeenAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
}

export async function getUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "onlineStatus lastSeenAt fullName profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: user._id,
      onlineStatus: user.onlineStatus,
      lastSeenAt: user.lastSeenAt,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user status" });
  }
}

// ✍️ TYPING INDICATOR
export async function updateTypingStatus(req, res) {
  try {
    const { isTyping, channelId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isTyping: isTyping,
        typingIn: isTyping ? channelId : null,
      },
      { new: true }
    );

    res.status(200).json({ success: true, isTyping });
  } catch (error) {
    res.status(500).json({ message: "Error updating typing status" });
  }
}

// 🔍 MESSAGE SEARCH
export async function searchMessages(req, res) {
  try {
    const { query, channelId } = req.query;

    if (!query || !channelId) {
      return res.status(400).json({ message: "Query and channelId are required" });
    }

    // Stream Chat search is done client-side or through Stream Chat API
    // For now, return empty results - Stream Chat handles this
    res.status(200).json({
      results: [],
      message: "Use Stream Chat client library for real-time message search",
    });
  } catch (error) {
    res.status(500).json({ message: "Error searching messages" });
  }
}

// 😊 MESSAGE REACTIONS (via Stream Chat)
export async function addMessageReaction(req, res) {
  try {
    const { messageId, emoji } = req.body;

    // Stream Chat handles reactions via their API
    // This is a placeholder for tracking or additional logic
    res.status(200).json({
      success: true,
      message: "Reaction added via Stream Chat",
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding reaction" });
  }
}

// 📌 PIN MESSAGE
export async function pinMessage(req, res) {
  try {
    const { messageId, channelId, content, senderId } = req.body;

    if (!messageId || !channelId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pinnedMessage = await PinnedMessage.create({
      messageId,
      channelId,
      content,
      senderId,
      pinnedBy: req.user._id,
      messageTimestamp: new Date(),
    });

    res.status(201).json({ success: true, pinnedMessage });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Message already pinned" });
    }
    res.status(500).json({ message: "Error pinning message" });
  }
}

// GET PINNED MESSAGES
export async function getPinnedMessages(req, res) {
  try {
    const { channelId } = req.params;

    const pinnedMessages = await PinnedMessage.find({ channelId })
      .populate("senderId", "fullName profilePic")
      .populate("pinnedBy", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, pinnedMessages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pinned messages" });
  }
}

// UNPIN MESSAGE
export async function unpinMessage(req, res) {
  try {
    const { messageId } = req.params;

    const pinnedMessage = await PinnedMessage.findOneAndDelete({ messageId });

    if (!pinnedMessage) {
      return res.status(404).json({ message: "Pinned message not found" });
    }

    res.status(200).json({ success: true, message: "Message unpinned" });
  } catch (error) {
    res.status(500).json({ message: "Error unpinning message" });
  }
}

// ⭐ ADD TO FAVORITES
export async function addToFavorites(req, res) {
  try {
    const { messageId, channelId, content, sender } = req.body;

    if (!messageId || !channelId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(req.user._id);

    // Check if already favorited
    const alreadyFavorited = user.favorites.some(
      (fav) => fav.messageId === messageId
    );

    if (alreadyFavorited) {
      return res.status(400).json({ message: "Message already in favorites" });
    }

    user.favorites.push({
      messageId,
      channelId,
      content,
      sender,
      timestamp: new Date(),
    });

    await user.save();

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error adding to favorites" });
  }
}

// REMOVE FROM FAVORITES
export async function removeFromFavorites(req, res) {
  try {
    const { messageId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { favorites: { messageId } },
      },
      { new: true }
    );

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error removing from favorites" });
  }
}

// GET FAVORITES
export async function getFavorites(req, res) {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites" });
  }
}

// 🎥 INITIATE VIDEO/AUDIO CALL
export async function initiateCall(req, res) {
  try {
    const { recipientId, callType } = req.body;

    if (!recipientId || !callType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["audio", "video"].includes(callType)) {
      return res.status(400).json({ message: "Invalid call type" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Generate unique call ID
    const callId = `call_${req.user._id}_${recipientId}_${Date.now()}`;

    // For video calls, create a Stream Video call
    let videoCall = null;
    let videoToken = null;

    if (callType === "video") {
      try {
        videoCall = await createVideoCall(callId, req.user._id);
        videoToken = generateVideoToken(req.user._id);
        console.log("Video call created:", callId);
      } catch (error) {
        console.error("Error creating video call:", error);
        return res.status(500).json({ message: "Failed to create video call" });
      }
    }

    res.status(200).json({
      success: true,
      callId,
      callType,
      videoToken: videoToken,
      caller: {
        id: req.user._id,
        name: req.user.fullName,
        profilePic: req.user.profilePic,
      },
      recipient: {
        id: recipient._id,
        name: recipient.fullName,
        profilePic: recipient.profilePic,
      },
    });
  } catch (error) {
    console.error("Error initiating call:", error);
    res.status(500).json({ message: "Error initiating call" });
  }
}

// 📞 END CALL & SAVE HISTORY
export async function endCall(req, res) {
  try {
    const { recipientId, callType, duration, status } = req.body;

    if (!recipientId || !callType || duration === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const callRecord = {
      calleeId: recipientId,
      callType,
      duration: Math.floor(duration),
      status: status || "completed",
      timestamp: new Date(),
    };

    // Save to caller's history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { callHistory: callRecord },
    });

    // Save to recipient's history
    await User.findByIdAndUpdate(recipientId, {
      $push: { callHistory: callRecord },
    });

    res.status(200).json({
      success: true,
      message: "Call ended and history saved",
    });
  } catch (error) {
    res.status(500).json({ message: "Error ending call" });
  }
}

// GET VIDEO TOKEN
export async function getVideoToken(req, res) {
  try {
    console.log("getVideoToken called for user:", req.user.id);
    const token = generateVideoToken(req.user.id);
    console.log("Generated video token:", token);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getVideoToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// CHECK FOR INCOMING CALLS (polling mechanism)
export async function checkIncomingCalls(req, res) {
  try {
    // In a real app, this would check a database or cache for pending calls
    // For now, return empty array
    res.status(200).json({ incomingCalls: [] });
  } catch (error) {
    console.error("Error checking incoming calls:", error);
    res.status(500).json({ message: "Error checking calls" });
  }
}

// GET CALL HISTORY
export async function getCallHistory(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate("callHistory.calleeId", "fullName profilePic email")
      .select("callHistory");

    res.status(200).json({ success: true, callHistory: user.callHistory });
  } catch (error) {
    res.status(500).json({ message: "Error fetching call history" });
  }
}
