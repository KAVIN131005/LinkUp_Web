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

  const handleStartCall = async (callType) => {
    try {
      if (!recipientId) {
        toast.error("No recipient selected");
        return;
      }

      const data = await initiateCall(recipientId, callType);

      setCallData({
        ...data,
        recipient: {
          id: recipientId,
          name: recipientName,
          profilePic: recipientImage,
        },
      });

      if (callType === "video") {
        setShowVideoCall(true);
      } else {
        setShowAudioCall(true);
      }

      toast.success(`📞 ${callType} call initiated`);
      setShowMenu(false);
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("Failed to initiate call");
    }
  };

  return (
    <>
      <div className="p-4 border-b border-base-300/30 flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0 bg-base-100/80 backdrop-blur-md z-10">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn btn-success btn-lg rounded-2xl px-6 bg-gradient-to-r from-success to-info hover:from-success/90 hover:to-info/90 border-0 text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-success/25 transition-all duration-300 group"
          >
            <VideoIcon className="size-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-2">Start Call</span>
          </button>

          {/* Call Options Menu */}
          {showMenu && (
            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => handleStartCall("video")}
                className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium text-gray-700 border-b"
              >
                <VideoIcon className="w-4 h-4 text-blue-500" />
                🎥 Video Call
              </button>
              <button
                onClick={() => handleStartCall("audio")}
                className="w-full px-4 py-3 hover:bg-green-50 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Phone className="w-4 h-4 text-green-500" />
                📱 Audio Call
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Call Window */}
      <VideoCallWindow
        isOpen={showVideoCall}
        callData={callData}
        onClose={() => setShowVideoCall(false)}
      />

      {/* Audio Call Window */}
      <AudioCallWindow
        isOpen={showAudioCall}
        callData={callData}
        onClose={() => setShowAudioCall(false)}
      />
    </>
  );
}

export default CallButton;
