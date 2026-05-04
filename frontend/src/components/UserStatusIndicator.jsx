import { useEffect, useState } from "react";
import { getUserStatus } from "../lib/api";

export default function UserStatusIndicator({ userId, userName, profilePic }) {
  const [status, setStatus] = useState("offline");
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getUserStatus(userId);
        setStatus(data.onlineStatus);
        setLastSeen(new Date(data.lastSeenAt));
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-400",
  };

  const formatLastSeen = () => {
    if (!lastSeen) return "";
    const now = new Date();
    const diff = now - lastSeen;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={profilePic || "https://via.placeholder.com/40"}
          alt={userName}
          className="w-10 h-10 rounded-full"
        />
        {/* 🟢 Status Indicator Dot */}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white`}
        />
      </div>

      <div>
        <p className="font-semibold text-sm">{userName}</p>
        <p className="text-xs text-gray-500">
          {status === "online" ? (
            <span className="text-green-600">🟢 Online</span>
          ) : (
            <span>Last seen {formatLastSeen()}</span>
          )}
        </p>
      </div>
    </div>
  );
}
