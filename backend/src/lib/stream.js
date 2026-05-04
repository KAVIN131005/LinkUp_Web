import { StreamChat } from "stream-chat";
import { StreamVideoClient } from "@stream-io/node-sdk";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Initialize Stream Video client
const videoClient = new StreamVideoClient({
  apiKey,
  secret: apiSecret,
});

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};

// Generate Stream Video token
export const generateVideoToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return videoClient.generateUserToken({
      user_id: userIdStr,
    });
  } catch (error) {
    console.error("Error generating Stream video token:", error);
  }
};

// Create a video call
export const createVideoCall = async (callId, userId) => {
  try {
    const call = videoClient.call("default", callId);
    await call.create({
      data: {
        created_by_id: userId.toString(),
        members: [],
      },
    });
    return call;
  } catch (error) {
    console.error("Error creating video call:", error);
    throw error;
  }
};

// Get call details
export const getCallDetails = async (callId) => {
  try {
    const call = videoClient.call("default", callId);
    const response = await call.get();
    return response;
  } catch (error) {
    console.error("Error getting call details:", error);
    throw error;
  }
};
