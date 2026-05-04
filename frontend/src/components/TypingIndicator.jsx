export default function TypingIndicator({ userName }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-2">
      <div className="flex gap-1">
        {/* Animated typing dots */}
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>
      <span className="text-sm text-gray-600">
        {userName} <span className="text-gray-500">is typing...</span>
      </span>
    </div>
  );
}
