import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, X } from "lucide-react";
import { endCall } from "../lib/api";
import toast from "react-hot-toast";

export default function AudioCallWindow({
  isOpen,
  callData,
  socket,
  authUser,
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

  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    if (!isOpen || !callData || !socket) return;

    console.log("📱 Starting audio call...");

    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    initializeCall();

    return () => {
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      cleanup();
    };
  }, [isOpen, callData, socket]);

  const initializeCall = async () => {
    try {
      console.log("🎤 Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("✅ Microphone access granted");
      setLocalStream(stream);

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
        localAudioRef.current.muted = true;
      }

      // Create peer connection
      const pc = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = pc;

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log("📡 Received remote stream");
        setRemoteStream(event.streams[0]);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
        setIsConnected(true);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("🧊 Sending ICE candidate");
          socket.emit("webrtc_ice_candidate", {
            to: callData.calleeId || callData.recipient?.id,
            from: authUser._id,
            candidate: event.candidate,
          });
        }
      };

      // Handle connection state
      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          toast.error("Connection failed");
        }
      };

      // Listen for remote signals
      socket.on("webrtc_offer", async (data) => {
        console.log("📡 Received offer");
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc_answer", {
            to: data.from,
            from: authUser._id,
            answer: answer,
          });
        } catch (err) {
          console.error("Error handling offer:", err);
        }
      });

      socket.on("webrtc_answer", async (data) => {
        console.log("📡 Received answer");
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (err) {
          console.error("Error handling answer:", err);
        }
      });

      socket.on("webrtc_ice_candidate", async (data) => {
        console.log("🧊 Adding ICE candidate");
        try {
          if (data.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc_offer", {
        to: callData.calleeId || callData.recipient?.id,
        from: authUser._id,
        offer: offer,
      });

      toast.success("📱 Audio call started");
    } catch (error) {
      console.error("❌ Error initializing call:", error);
      setError(error.message);
      toast.error(`❌ Microphone error: ${error.message}`);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall(
        callData.calleeId || callData.recipient?.id,
        callData.callType,
        duration,
        "completed"
      );
    } catch (error) {
      console.error("Error ending call:", error);
    }
    cleanup();
    onClose();
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    socket?.off("webrtc_offer");
    socket?.off("webrtc_answer");
    socket?.off("webrtc_ice_candidate");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Contact Info */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            {callData.recipient?.profilePic ? (
              <img
                src={callData.recipient.profilePic}
                alt={callData.recipient.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">
                {callData.recipient?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {callData.recipient?.name || "User"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isConnected ? "🟢 Connected" : "📞 Ringing..."}
          </p>
        </div>

        {/* Duration */}
        <div className="text-center mb-8">
          <p className="text-4xl font-mono font-bold text-gray-800">
            {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition ${
              isMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 hover:bg-gray-400"
            } text-white`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Hidden audio elements */}
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
