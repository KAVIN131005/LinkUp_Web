import { useEffect, useState } from "react";
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
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import MessageSearchBar from "../components/MessageSearchBar";
import PinnedMessagesBar from "../components/PinnedMessagesBar";
import FavoritesList from "../components/FavoritesList";
import UserStatusIndicator from "../components/UserStatusIndicator";
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
    <div className="h-[93vh] flex flex-col">
      {/* Feature Controls Bar */}
      <div className="bg-gray-50 border-b px-4 py-2 flex items-center gap-2">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 hover:bg-gray-200 rounded-lg transition flex items-center gap-1 text-sm"
          title="Search messages"
        >
          <Search className="w-4 h-4" />
          🔍
        </button>
        <button
          onClick={() => setShowPinned(!showPinned)}
          className="p-2 hover:bg-gray-200 rounded-lg transition flex items-center gap-1 text-sm"
          title="Show pinned messages"
        >
          📌
        </button>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="p-2 hover:bg-gray-200 rounded-lg transition flex items-center gap-1 text-sm"
          title="Show favorites"
        >
          <Star className="w-4 h-4" />
          ⭐
        </button>
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

      {/* Main Chat Area */}
      <div className="h-[93vh] flex-1">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full relative h-full flex flex-col">
              {/* Recipient Status */}
              {recipientData && (
                <div className="p-3 bg-blue-50 border-b">
                  <UserStatusIndicator
                    userId={targetUserId}
                    userName={recipientData.fullName}
                    profilePic={recipientData.profilePic}
                  />
                </div>
              )}

              <CallButton
                recipientId={targetUserId}
                recipientName={recipientData?.fullName || "User"}
                recipientImage={recipientData?.profilePic}
              />

              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
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
