import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  console.log("Making API call to get user friends...");
  try {
    const response = await axiosInstance.get("/users/friends");
    console.log("Friends API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  console.log("Making API call to get stream token...");
  try {
    const response = await axiosInstance.get("/chat/token");
    console.log("Stream token API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching stream token:", error);
    throw error;
  }
}

// 🟢 USER ONLINE STATUS APIs
export async function updateUserStatus(status) {
  const response = await axiosInstance.post("/features/status/update", { status });
  return response.data;
}

export async function getUserStatus(userId) {
  const response = await axiosInstance.get(`/features/status/${userId}`);
  return response.data;
}

// ✍️ TYPING INDICATOR APIs
export async function updateTypingStatus(isTyping, channelId) {
  const response = await axiosInstance.post("/features/typing", {
    isTyping,
    channelId,
  });
  return response.data;
}

// 🔍 MESSAGE SEARCH API
export async function searchMessages(query, channelId) {
  const response = await axiosInstance.get("/features/search", {
    params: { query, channelId },
  });
  return response.data;
}

// 😊 EMOJI REACTIONS API
export async function addMessageReaction(messageId, emoji) {
  const response = await axiosInstance.post("/features/reactions/add", {
    messageId,
    emoji,
  });
  return response.data;
}

// 📌 MESSAGE PINNING APIs
export async function pinMessage(messageId, channelId, content, senderId) {
  const response = await axiosInstance.post("/features/pin", {
    messageId,
    channelId,
    content,
    senderId,
  });
  return response.data;
}

export async function getPinnedMessages(channelId) {
  const response = await axiosInstance.get(`/features/pinned/${channelId}`);
  return response.data;
}

export async function unpinMessage(messageId) {
  const response = await axiosInstance.delete(`/features/pin/${messageId}`);
  return response.data;
}

// ⭐ FAVORITES APIs
export async function addToFavorites(messageId, channelId, content, sender) {
  const response = await axiosInstance.post("/features/favorites/add", {
    messageId,
    channelId,
    content,
    sender,
  });
  return response.data;
}

export async function removeFromFavorites(messageId) {
  const response = await axiosInstance.delete(`/features/favorites/${messageId}`);
  return response.data;
}

export async function getFavorites() {
  const response = await axiosInstance.get("/features/favorites");
  return response.data;
}

// 🎥 📱 CALL APIs
export async function initiateCall(recipientId, callType) {
  const response = await axiosInstance.post("/features/calls/initiate", {
    recipientId,
    callType,
  });
  return response.data;
}

export async function endCall(recipientId, callType, duration, status) {
  const response = await axiosInstance.post("/features/calls/end", {
    recipientId,
    callType,
    duration,
    status,
  });
  return response.data;
}

export async function getCallHistory() {
  const response = await axiosInstance.get("/features/calls/history");
  return response.data;
}
