import { useState } from "react";
import { Smile } from "lucide-react";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "💯", "🎉"];

export default function EmojiReactions({ messageId, onReact }) {
  const [showPicker, setShowPicker] = useState(false);
  const [reactions, setReactions] = useState({});

  const handleReaction = async (emoji) => {
    try {
      await onReact?.(messageId, emoji);

      // Update local reactions
      setReactions((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1,
      }));

      setShowPicker(false);
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  return (
    <div className="relative">
      {/* Reaction Picker Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-1 hover:bg-gray-100 rounded-lg transition text-sm"
        title="Add reaction"
      >
        <Smile className="w-4 h-4" />
      </button>

      {/* Emoji Picker Popup */}
      {showPicker && (
        <div className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1 z-50">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="hover:scale-125 hover:bg-gray-100 p-2 rounded transition duration-200 text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Show Reactions */}
      {Object.keys(reactions).length > 0 && (
        <div className="flex gap-1 mt-1 flex-wrap">
          {Object.entries(reactions).map(([emoji, count]) => (
            <div
              key={emoji}
              className="bg-gray-100 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 hover:bg-gray-200 cursor-pointer"
            >
              <span>{emoji}</span>
              {count > 1 && <span className="text-gray-600">{count}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
