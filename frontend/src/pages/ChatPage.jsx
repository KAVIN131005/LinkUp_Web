import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, updateUserStatus, getUserStatus, addMessageReaction } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import MessageSearchBar from "../components/MessageSearchBar";
import PinnedMessagesBar from "../components/PinnedMessagesBar";
import FavoritesList from "../components/FavoritesList";
import UserStatusIndicator from "../components/UserStatusIndicator";
import CustomMessage from "../components/CustomMessage";
import { Star, Search } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  useDocumentTitle("Chat");

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [recipientData, setRecipientData] = useState(null);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Update user status to online (only once on mount)
  useEffect(() => {
    if (authUser && authUser._id) {
      updateUserStatus("online").catch((error) => {
        console.error("Error updating status:", error);
        // Continue anyway even if status update fails
      });

      // Set back to offline on component unmount
      return () => {
        updateUserStatus("offline").catch(console.error);
      };
    }
  }, [authUser?._id]);

  // Fetch recipient's status (only once)
  useEffect(() => {
    if (targetUserId && authUser) {
      const timer = setTimeout(() => {
        getUserStatus(targetUserId)
          .then((data) => {
            setRecipientData(data);
          })
          .catch((error) => {
            console.error("Error fetching status:", error);
            // Fallback: just set basic recipient data
            setRecipientData({
              fullName: "User",
              profilePic: "",
              onlineStatus: "offline"
            });
          });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [targetUserId, authUser]);

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* TOP HEADER - User Info & Call Button */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-600 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Left: Avatar & User Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {recipientData?.profilePic ? (
              <img
                src={recipientData.profilePic}
                alt={recipientData.fullName}
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border-2 border-emerald-500 shadow-lg flex-shrink-0"
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(recipientData.fullName || "User");
                }}
              />
            ) : (
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border-2 border-emerald-500">
                <span className="text-lg sm:text-xl font-bold">
                  {recipientData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold truncate">
                {recipientData?.fullName || "Loading..."}
              </h2>
              <p className={`text-xs sm:text-sm ${recipientData?.onlineStatus === "online" ? "text-emerald-300" : "text-slate-400"}`}>
                {recipientData?.onlineStatus === "online" ? "🟢 Online" : "🔴 Offline"}
              </p>
            </div>
          </div>

          {/* Right: Features & Call Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
              title="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => setShowPinned(!showPinned)}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
              title="Pinned"
            >
              📌
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
              title="Favorites"
            >
              <Star className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="h-6 w-px bg-slate-600 mx-1"></div>
            {/* Call Button via Portal */}
            <CallButton
              recipientId={targetUserId}
              recipientName={recipientData?.fullName || "User"}
              recipientImage={recipientData?.profilePic}
            />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <MessageSearchBar
          channelId={channel?.id}
          onSearch={(query) => {
            toast.info(`Searching for: ${query}`);
          }}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Pinned Messages Bar */}
      <PinnedMessagesBar
        channelId={channel?.id}
        isOpen={showPinned}
        onClose={() => setShowPinned(false)}
      />

      {/* MAIN CHAT AREA */}
      <div className="flex-1 overflow-hidden">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList Message={CustomMessage} />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>

      {/* Favorites Modal */}
      <FavoritesList isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
    </div>
  );
};
export default ChatPage;
