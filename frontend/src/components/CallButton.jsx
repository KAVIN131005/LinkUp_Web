import { useState } from "react";
import { VideoIcon, Phone } from "lucide-react";
import { initiateCall } from "../lib/api";
import VideoCallWindow from "./VideoCallWindow";
import AudioCallWindow from "./AudioCallWindow";
import toast from "react-hot-toast";

function CallButton({ recipientId, recipientName, recipientImage }) {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [callData, setCallData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);

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

      setCallData({
        ...data,
        recipient: {
          id: recipientId,
          name: recipientName,
          profilePic: recipientImage,
        },
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

  return (
    <>
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
              className="w-full px-4 py-3 hover:bg-green-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition"
            >
              <Phone className="w-5 h-5 text-green-500" />
              <span>📱 Audio Call</span>
            </button>
          </div>
        )}
      </div>

      {/* Video Call Window */}
      {showVideoCall && (
        <VideoCallWindow
          isOpen={showVideoCall}
          callData={callData}
          onClose={() => {
            console.log("Closing video call...");
            setShowVideoCall(false);
          }}
        />
      )}

      {/* Audio Call Window */}
      {showAudioCall && (
        <AudioCallWindow
          isOpen={showAudioCall}
          callData={callData}
          onClose={() => {
            console.log("Closing audio call...");
            setShowAudioCall(false);
          }}
        />
      )}
    </>
  );
}

export default CallButton;
