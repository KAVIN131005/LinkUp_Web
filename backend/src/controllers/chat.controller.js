import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    console.log("getStreamToken called for user:", req.user.id);
    const token = generateStreamToken(req.user.id);
    console.log("Generated token:", token);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
