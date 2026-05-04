import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, X } from "lucide-react";
import { endCall } from "../lib/api";
import toast from "react-hot-toast";

export default function AudioCallWindow({
  isOpen,
  callData,
  onClose,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const durationIntervalRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // WebRTC configuration
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    if (!isOpen || !callData) {
      console.log("AudioCallWindow not open or no callData");
      return;
    }

    console.log("📱 Starting audio call setup...");

    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Initialize WebRTC
    initializeCall();

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      cleanup();
    };
  }, [isOpen, callData]);

  const initializeCall = async () => {
    try {
      console.log("🎤 Requesting microphone access...");

      // Get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("✅ Microphone access granted");
      setLocalStream(stream);

      // Set up local audio
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration);

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        console.log("📡 Received remote stream");
        setRemoteStream(event.streams[0]);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
        setIsConnected(true);
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("ICE candidate:", event.candidate);
          // In a real app, send this to the other peer via signaling server
        }
      };

      // For demo purposes, create offer and immediately accept it
      // In real app, this would be exchanged via WebSocket/Socket.io
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      // Simulate receiving answer (in real app, this comes from other peer)
      setTimeout(async () => {
        try {
          await peerConnectionRef.current.setRemoteDescription(offer);
          setIsConnected(true);
          console.log("✅ Call connected (demo mode)");
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      }, 1000);

    } catch (err) {
      console.error("❌ Error accessing microphone:", err);
      setError(err.message || "Could not access microphone");
      toast.error(`❌ Microphone error: ${err.message}`);
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        console.log("🛑 Stopping local track");
        track.stop();
      });
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => {
        console.log("🛑 Stopping remote track");
        track.stop();
      });
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const handleEndCall = async () => {
    try {
      console.log("📞 Ending audio call...");

      cleanup();
      await endCall(
        callData.recipient.id,
        "audio",
        duration,
        "completed"
      );

      toast.success("✅ Call ended");
      setTimeout(onClose, 500);
    } catch (error) {
      console.error("❌ Error ending call:", error);
      onClose();
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // If muted, enable (unmute)
        console.log(`🎤 Audio ${track.enabled ? 'unmuted' : 'muted'}`);
      });
      setIsMuted(!isMuted);
    }
  };

  const formatDuration = () => {
    const hrs = Math.floor(duration / 3600);
    const mins = Math.floor((duration % 3600) / 60);
    const secs = duration % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 z-50 flex flex-col items-center justify-center p-4">
      {/* Call Card */}
      <div className="bg-white bg-opacity-10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 lg:p-12 text-center max-w-md w-full mx-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleEndCall}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition lg:hidden"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Avatar */}
        <div className="mb-6 lg:mb-8">
          <div className="relative inline-block">
            <img
              src={callData?.recipient?.profilePic || "https://via.placeholder.com/120"}
              alt={callData?.recipient?.name}
              className="w-24 lg:w-32 h-24 lg:h-32 rounded-full mx-auto border-4 border-white object-cover shadow-lg animate-pulse"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/120";
              }}
            />
            {isConnected && (
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 drop-shadow-lg">
          {callData?.recipient?.name || "Unknown"}
        </h2>

        {/* Duration */}
        <p className="text-5xl lg:text-6xl font-mono text-blue-100 mb-4 font-bold drop-shadow-lg">
          {formatDuration()}
        </p>

        {/* Status */}
        <p className="text-blue-200 mb-8 text-base lg:text-lg drop-shadow-lg">
          {isConnected ? "📞 Audio Call Connected" : "📞 Connecting..."}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-600/80 text-white px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          {/* Mute Audio */}
          <button
            onClick={toggleAudio}
            className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full transition transform hover:scale-110 flex items-center justify-center font-bold ${
              isMuted
                ? "bg-red-600 hover:bg-red-700 ring-2 ring-red-300"
                : "bg-gray-700 hover:bg-gray-600 ring-2 ring-gray-400"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            ) : (
              <Mic className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-red-600 hover:bg-red-700 transition transform hover:scale-110 flex items-center justify-center ring-2 ring-red-300"
            title="End Call"
          >
            <PhoneOff className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </button>
        </div>

        {/* Muted Status */}
        {isMuted && (
          <p className="text-orange-300 text-sm lg:text-base drop-shadow-lg font-semibold">
            🔇 You are muted
          </p>
        )}

        {/* Connection Status */}
        {isConnected && (
          <p className="text-green-300 text-xs lg:text-sm mt-4 drop-shadow-lg">
            ✅ Connected
          </p>
        )}

        {/* Hidden audio elements */}
        <audio ref={localAudioRef} muted autoPlay />
        <audio ref={remoteAudioRef} autoPlay />
      </div>
    </div>
  );
}
