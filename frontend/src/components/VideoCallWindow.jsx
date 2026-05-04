import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Minimize2 } from "lucide-react";
import { endCall } from "../lib/api";
import toast from "react-hot-toast";

export default function VideoCallWindow({
  isOpen,
  callData,
  socket,
  authUser,
  onClose,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const durationIntervalRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

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

    console.log("🎥 Starting video call...");

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
      console.log("🎥 Requesting camera and microphone...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      console.log("✅ Camera and microphone access granted");
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }

      // Create peer connection
      const pc = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = pc;

      // Add local stream tracks
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log("📺 Received remote stream");
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
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

      // Handle connection state change
      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          toast.error("Connection failed");
        }
      };

      // Listen for remote offer/answer
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

      toast.success("🎥 Video call started");
    } catch (error) {
      console.error("❌ Error initializing call:", error);
      setError(error.message);
      toast.error(`❌ Camera/Microphone error: ${error.message}`);
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

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-6xl max-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-lg">
              {callData.recipient?.name || "User"}
            </h2>
            <p className="text-gray-400 text-sm">
              {isConnected ? "🟢 Connected" : "📞 Connecting..."}
            </p>
          </div>
          <div className="text-white font-mono text-lg">
            {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex gap-4 p-4 bg-black overflow-hidden">
          {/* Remote Video */}
          <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <p className="text-gray-400 mb-4">Waiting for remote video...</p>
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              </div>
            )}
          </div>

          {/* Local Video */}
          <div className="w-40 h-40 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!localStream && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500 text-xs">Loading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 px-6 py-4 flex justify-center gap-6">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition ${
              isMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-600 hover:bg-gray-700"
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
            onClick={toggleVideo}
            className={`p-3 rounded-full transition ${
              !isVideoOn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white`}
            title={isVideoOn ? "Stop Video" : "Start Video"}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500 text-white px-6 py-2 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
