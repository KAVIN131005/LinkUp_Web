import { useState } from "react";
import { Pin, Heart, Star, Copy } from "lucide-react";
import { pinMessage, addToFavorites } from "../lib/api";
import toast from "react-hot-toast";

export default function MessageContextMenu({
  messageId,
  channelId,
  content,
  senderId,
  senderName,
  position,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  const handlePin = async () => {
    try {
      setLoading(true);
      await pinMessage(messageId, channelId, content, senderId);
      toast.success("📌 Message pinned!");
      onClose();
    // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      toast.error("Failed to pin message");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      setLoading(true);
      await addToFavorites(messageId, channelId, content, senderName);
      toast.success("⭐ Added to favorites!");
      onClose();
    // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      toast.error("Failed to add favorite");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("📋 Copied to clipboard!");
    onClose();
  };

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
      style={{
        top: position?.top,
        left: position?.left,
      }}
    >
      <button
        onClick={handlePin}
        disabled={loading}
        className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm transition disabled:opacity-50"
      >
        <Pin className="w-4 h-4" />
        📌 Pin
      </button>

      <button
        onClick={handleFavorite}
        disabled={loading}
        className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm transition disabled:opacity-50"
      >
        <Star className="w-4 h-4" />
        ⭐ Favorite
      </button>

      <button
        onClick={handleCopy}
        className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm transition"
      >
        <Copy className="w-4 h-4" />
        📋 Copy
      </button>
    </div>
  );
}
