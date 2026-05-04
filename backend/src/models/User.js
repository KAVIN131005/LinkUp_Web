import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // 🟢 Online Status Feature
    onlineStatus: {
      type: String,
      enum: ["online", "away", "busy", "offline"],
      default: "offline",
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    // ✍️ Typing Status
    isTyping: {
      type: Boolean,
      default: false,
    },
    typingIn: {
      type: String,
      default: null,
    },
    // ⭐ Favorites Feature
    favorites: [
      {
        messageId: String,
        channelId: String,
        content: String,
        sender: String,
        timestamp: Date,
      },
    ],
    // 🔔 Call History
    callHistory: [
      {
        calleeId: mongoose.Schema.Types.ObjectId,
        callType: {
          type: String,
          enum: ["audio", "video"],
        },
        duration: Number,
        status: {
          type: String,
          enum: ["completed", "missed", "declined"],
        },
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
