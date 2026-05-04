import mongoose from "mongoose";

const pinnedMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    pinnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageTimestamp: Date,
  },
  { timestamps: true }
);

const PinnedMessage = mongoose.model("PinnedMessage", pinnedMessageSchema);

export default PinnedMessage;
