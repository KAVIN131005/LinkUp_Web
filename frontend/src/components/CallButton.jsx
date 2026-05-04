import { useState, useEffect } from "react";
import { VideoIcon, Phone } from "lucide-react";
import { initiateCall } from "../lib/api";
import VideoCallWindow from "./VideoCallWindow";
import AudioCallWindow from "./AudioCallWindow";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import useAuthUser from "../hooks/useAuthUser";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

function CallButton({ recipientId, recipientName, recipientImage }) {
  const { authUser } = useAuthUser();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [callData, setCallData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  // Initialize Socket.io connection
  useEffect(() => {
    if (!authUser?._id) return;

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      newSocket.emit("user_online", authUser._id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // Listen for incoming calls
    newSocket.on("incoming_call", (data) => {
      console.log("📞 Incoming call:", data);
      setIncomingCall(data);
      toast.success(`📞 ${data.callerName} is calling you (${data.callType})`);
    });

    // Listen for call acceptance
    newSocket.on("call_accepted", (data) => {
      console.log("✅ Call accepted");
      setCallData(prev => ({ ...prev, accepted: true, answer: data.answer }));
    });

    // Listen for call rejection
    newSocket.on("call_rejected", () => {
      console.log("❌ Call rejected");
      toast.error("Call was rejected");
      setShowVideoCall(false);
      setShowAudioCall(false);
    });

    // Listen for call ended
    newSocket.on("call_ended", () => {
      console.log("📵 Call ended");
      setShowVideoCall(false);
      setShowAudioCall(false);
      setCallData(null);
    });

    // WebRTC signaling events
    newSocket.on("webrtc_offer", (data) => {
      console.log("📡 Received WebRTC offer");
      setCallData(prev => ({ ...prev, offer: data.offer }));
    });

    newSocket.on("webrtc_answer", (data) => {
      console.log("📡 Received WebRTC answer");
      setCallData(prev => ({ ...prev, answer: data.answer }));
    });

    newSocket.on("webrtc_ice_candidate", (data) => {
      console.log("🧊 Received ICE candidate");
      if (setCallData) {
        setCallData(prev => ({
          ...prev,
          iceCandidates: [...(prev?.iceCandidates || []), data.candidate]
        }));
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authUser?._id]);

  const handleStartCall = async (callType) => {
    try {
      if (!recipientId) {
        toast.error("❌ No recipient selected");
        return;
      }

      setIsInitiating(true);
      console.log(`Initiating ${callType} call to ${recipientId}...`);

      const data = await initiateCall(recipientId, callType);
      console.log("Call initiated successfully:", data);

      const callInfo = {
        ...data,
        calleeId: recipientId,
        callType,
        recipient: {
          id: recipientId,
          name: recipientName,
          profilePic: recipientImage,
        },
      };

      setCallData(callInfo);

      // Send call signal through socket
      socket.emit("call_start", {
        callerId: authUser._id,
        callerName: authUser.fullName,
        calleeId: recipientId,
        callType,
        callData: callInfo,
      });

      if (callType === "video") {
        console.log("Opening video call window...");
        setShowVideoCall(true);
      } else {
        console.log("Opening audio call window...");
        setShowAudioCall(true);
      }

      toast.success(`✅ ${callType === 'video' ? '🎥' : '📱'} ${callType} call initiated`);
      setShowMenu(false);
      setIsInitiating(false);
    } catch (error) {
      console.error("❌ Error initiating call:", error);
      setIsInitiating(false);
      toast.error(`❌ Failed to initiate ${callType} call: ${error.message || 'Unknown error'}`);
    }
  };

  const handleAcceptCall = (callType) => {
    if (!incomingCall) return;

    setCallData({
      ...incomingCall,
      callType,
    });

    socket.emit("call_accept", {
      callerId: incomingCall.callerId,
      calleeId: authUser._id,
    });

    setIncomingCall(null);

    if (callType === "video") {
      setShowVideoCall(true);
    } else {
      setShowAudioCall(true);
    }
  };

  const handleRejectCall = () => {
    if (!incomingCall) return;

    socket.emit("call_reject", {
      callerId: incomingCall.callerId,
      calleeId: authUser._id,
    });

    setIncomingCall(null);
    toast.info("📞 Call rejected");
  };

  return (
    <>
      {/* Incoming call notification */}
      {incomingCall && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white rounded-lg shadow-lg p-4 z-50 max-w-sm">
          <p className="font-bold mb-2">📞 Incoming {incomingCall.callType} call from {incomingCall.callerName}</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleAcceptCall(incomingCall.callType)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold"
            >
              Accept
            </button>
            <button
              onClick={handleRejectCall}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={isInitiating}
          className="p-2 hover:bg-blue-700 rounded-lg transition flex items-center gap-1 sm:gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold disabled:opacity-50"
          title="Start a call"
        >
          <VideoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline text-sm">{isInitiating ? 'Calling...' : 'Call'}</span>
        </button>

        {/* Call Options Menu */}
        {showMenu && !isInitiating && (
          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden z-50 min-w-max">
            {/* Video Call Option */}
            <button
              onClick={() => handleStartCall("video")}
              className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium text-gray-700 border-b transition"
            >
              <VideoIcon className="w-5 h-5 text-blue-500" />
              <span>🎥 Video Call</span>
            </button>

            {/* Audio Call Option */}
            <button
              onClick={() => handleStartCall("audio")}
              className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition"
            >
              <Phone className="w-5 h-5 text-green-500" />
              <span>📱 Audio Call</span>
            </button>
          </div>
        )}
      </div>

      {/* Video Call Window */}
      {showVideoCall && callData && (
        <VideoCallWindow
          isOpen={showVideoCall}
          callData={callData}
          socket={socket}
          authUser={authUser}
          onClose={() => {
            setShowVideoCall(false);
            socket.emit("call_end", {
              callerId: authUser._id,
              calleeId: callData.calleeId || callData.recipient?.id,
            });
          }}
        />
      )}

      {/* Audio Call Window */}
      {showAudioCall && callData && (
        <AudioCallWindow
          isOpen={showAudioCall}
          callData={callData}
          socket={socket}
          authUser={authUser}
          onClose={() => {
            setShowAudioCall(false);
            socket.emit("call_end", {
              callerId: authUser._id,
              calleeId: callData.calleeId || callData.recipient?.id,
            });
          }}
        />
      )}
    </>
  );
}

export default CallButton;
