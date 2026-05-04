import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { endCall } from "../lib/api";
import toast from "react-hot-toast";

export default function VideoCallWindow({
  isOpen,
  callData,
  onClose,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const durationIntervalRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Request access to camera
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        toast.error("Could not access camera/microphone");
      });

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isOpen]);

  const handleEndCall = async () => {
    try {
      await endCall(
        callData.recipient.id,
        "video",
        duration,
        "completed"
      );
      toast.success("Call ended");
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error("Error ending call:", error);
      onClose();
    }
  };

  const formatDuration = () => {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Video Container */}
      <div className="relative w-full h-full">
        {/* Remote Video (Large) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover bg-gray-900"
          autoPlay
          playsInline
        />

        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-20 right-6 w-32 h-40 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* Call Info */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
          <h3 className="text-white text-lg font-bold">
            {callData.recipient.name}
          </h3>
          <p className="text-gray-300 text-sm">🎥 Video Call • {formatDuration()}</p>
        </div>

        {/* Control Buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* Mute Audio */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition ${
              isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Toggle Video */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-full transition ${
              !isVideoOn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
