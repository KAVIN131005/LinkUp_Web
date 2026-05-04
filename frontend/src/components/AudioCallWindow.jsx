import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { endCall } from "../lib/api";
import toast from "react-hot-toast";

export default function AudioCallWindow({
  isOpen,
  callData,
  onClose,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Request access to microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        // For audio call, we just need the stream
        // In a real app, you'd establish WebRTC connection here
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        toast.error("Could not access microphone");
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
        "audio",
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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-900 z-50 flex flex-col items-center justify-center">
      {/* Call Card */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-12 text-center max-w-md w-full mx-4 shadow-2xl">
        {/* Avatar */}
        <div className="mb-6">
          <img
            src={callData.recipient.profilePic || "https://via.placeholder.com/100"}
            alt={callData.recipient.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-white object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {callData.recipient.name}
        </h2>

        {/* Duration */}
        <p className="text-4xl font-mono text-blue-100 mb-4 font-bold">
          {formatDuration()}
        </p>

        {/* Status */}
        <p className="text-blue-200 mb-8">📞 Audio Call Active</p>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          {/* Mute Audio */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full transition flex items-center justify-center ${
              isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isMuted ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 transition flex items-center justify-center"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Muted Status */}
        {isMuted && (
          <p className="text-orange-300 text-sm">
            🔇 You are muted
          </p>
        )}
      </div>
    </div>
  );
}
