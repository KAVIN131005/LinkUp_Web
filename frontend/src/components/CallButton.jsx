import { useState } from "react";
import { VideoIcon, Phone, X } from "lucide-react";
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
      {/* Call Button Container */}
      <div className="p-4 border-b border-base-300/30 flex items-center justify-end gap-2 bg-base-100/80 backdrop-blur-md sticky top-0 z-20">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            disabled={isInitiating}
            className="btn btn-success btn-md md:btn-lg rounded-2xl px-4 md:px-6 bg-gradient-to-r from-success to-info hover:from-success/90 hover:to-info/90 border-0 text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-success/25 transition-all duration-300 group disabled:opacity-50"
          >
            <VideoIcon className="size-5 md:size-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-2 hidden sm:inline">{isInitiating ? 'Calling...' : 'Start Call'}</span>
            <span className="ml-2 sm:hidden">{isInitiating ? 'Calling' : 'Call'}</span>
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
