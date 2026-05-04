import { useEffect, useState } from "react";
import { Pin, ChevronDown, ChevronUp, X } from "lucide-react";
import { getPinnedMessages, unpinMessage } from "../lib/api";

export default function PinnedMessagesBar({ channelId, isOpen, onClose }) {
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !channelId) return;

    const fetchPinned = async () => {
      try {
        const data = await getPinnedMessages(channelId);
        setPinnedMessages(data.pinnedMessages || []);
      } catch (error) {
        console.error("Error fetching pinned messages:", error);
      }
    };

    fetchPinned();
  }, [isOpen, channelId]);

  if (!isOpen || pinnedMessages.length === 0) return null;

  const currentMessage = pinnedMessages[currentIndex];

  const handleUnpin = async (messageId) => {
    try {
      await unpinMessage(messageId);
      setPinnedMessages((prev) => prev.filter((m) => m.messageId !== messageId));
      if (currentIndex >= pinnedMessages.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } catch (error) {
      console.error("Error unpinning message:", error);
    }
  };

  return (
    <div className="bg-amber-50 border-b-2 border-amber-300 p-3 flex items-start gap-3">
      <Pin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-amber-900 mb-1">
          📌 Pinned Messages ({pinnedMessages.length})
        </p>
        {currentMessage && (
          <div className="bg-white p-2 rounded border border-amber-200">
            <p className="text-xs text-gray-600 font-medium">
              {currentMessage.senderId?.fullName || "User"}
            </p>
            <p className="text-sm text-gray-800 truncate">{currentMessage.content}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-1 flex-shrink-0">
        {pinnedMessages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + pinnedMessages.length) % pinnedMessages.length)}
              className="p-1 hover:bg-amber-200 rounded transition"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % pinnedMessages.length)}
              className="p-1 hover:bg-amber-200 rounded transition"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={() => handleUnpin(currentMessage?.messageId)}
          className="p-1 hover:bg-amber-200 rounded transition text-amber-600"
          title="Unpin this message"
        >
          <X className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-1 hover:bg-amber-200 rounded transition text-amber-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
