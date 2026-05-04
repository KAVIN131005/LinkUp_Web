import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Minimize2 } from "lucide-react";
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
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const durationIntervalRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const websocketRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !callData) {
      console.log("VideoCallWindow not open or no callData");
      return;
    }

    console.log("🎥 Starting video call setup...");

    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Initialize WebRTC call
    initializeCall();

    return () => {
      cleanup();
    };
  }, [isOpen, callData]);

  const initializeCall = async () => {
    try {
      console.log("🎥 Initializing WebRTC video call...");

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      console.log("✅ Camera and microphone access granted");
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("✅ Local video stream set");
      }

      // Initialize WebRTC peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = pc;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
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
          // In a real app, send candidate to signaling server
          console.log("ICE candidate:", event.candidate);
        }
      };

      // For demo purposes, create offer and immediately set as answer
      // In real app, this would be exchanged via signaling server
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Simulate remote answer (in real app, this comes from other peer)
      setTimeout(async () => {
        try {
          await pc.setRemoteDescription(offer);
          console.log("✅ Call connected (demo mode)");
        } catch (error) {
          console.log("Demo connection setup");
        }
      }, 1000);

      setError(null);
    } catch (err) {
      console.error("❌ Error initializing video call:", err);
      setError(err.message || "Could not access camera/microphone");
      toast.error(`❌ Video call error: ${err.message}`);
    }
  };

  const cleanup = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (websocketRef.current) {
      websocketRef.current.close();
    }
  };

  const handleEndCall = async () => {
    try {
      console.log("📞 Hanging up call...");

      cleanup();

      await endCall(
        callData.recipient.id,
        "video",
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
        track.enabled = isMuted;
        console.log(`🎤 Audio ${track.enabled ? 'unmuted' : 'muted'}`);
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
        console.log(`📹 Video ${track.enabled ? 'on' : 'off'}`);
      });
      setIsVideoOn(!isVideoOn);
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Video Container */}
      <div className="relative w-full h-full">
        {/* Remote Video (Large) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover bg-gray-900"
          autoPlay
          playsInline
          onLoadedMetadata={() => console.log("📺 Remote video loaded")}
        />

        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-24 right-6 w-32 h-40 rounded-xl overflow-hidden border-4 border-white shadow-2xl bg-black">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => console.log("📷 Local video loaded")}
          />
        </div>

        {/* Call Info */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
          <h3 className="text-white text-xl lg:text-2xl font-bold drop-shadow-lg">
            {callData?.recipient?.name || "Unknown"}
          </h3>
          <p className="text-gray-200 text-sm lg:text-base drop-shadow-lg">
            🎥 Video Call • {formatDuration()}
            {isConnected && " • Connected"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Control Buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* Mute Audio */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition transform hover:scale-110 ${
              isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition transform hover:scale-110 ${
              !isVideoOn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={isVideoOn ? "Stop Video" : "Start Video"}
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
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition transform hover:scale-110"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
