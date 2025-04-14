import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
// import { MeetingRoom } from "@/components/mentorship/MeetingRoom"; // Keep commented if not used
import { Button } from "@/components/ui/button";

// Define message types for clarity
interface SignalMessage {
  type: 'signal';
  userId: string;
  meetingId: string;
  signal: Peer.SignalData;
}

interface JoinMessage {
  type: 'join';
  userId: string;
  meetingId: string;
}

type WebSocketMessage = SignalMessage | JoinMessage;

// --- Default Signaling Server URL --- //
// !!! IMPORTANT: Replace this with your actual signaling server address !!!
const SIGNALING_SERVER_URL = 'ws://localhost:8081';
// ------------------------------------ //

const MeetingRoomPage = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [isConnected, setIsConnected] = useState(false); // Track peer connection state

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null); // Use ref to avoid stale closure issues in WebSocket callbacks

  // TODO: Replace with actual meeting/user identification from your app state/URL
  const meetingId = "test-meeting"; // Example: Extract from URL params
  const userId = "user-" + Math.random().toString(16).slice(2); // Example: Use actual logged-in user ID
  // Determine initiator based on application logic (e.g., first person in room)
  // For simplicity, we can have the signaling server decide or use a simple hash again
  const isInitiator = window.location.hash === '#init'; // Keep for now, but ideally server manages this

  useEffect(() => {
    console.log("Attempting to get user media...");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("getUserMedia success.");
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize WebSocket connection
        console.log(`Connecting to signaling server: ${SIGNALING_SERVER_URL}`);
        socketRef.current = new WebSocket(SIGNALING_SERVER_URL);
        setupSignaling(stream); // Setup WebSocket handlers
      })
      .catch((err) => {
        console.error("Failed to get local stream:", err);
        // Consider adding user feedback here (e.g., display an error message)
      });

    // Cleanup function
    return () => {
      console.log("Cleaning up MeetingRoomPage...");
      localStream?.getTracks().forEach((track) => track.stop());
      peerRef.current?.destroy();
      socketRef.current?.close();
      setPeer(null);
      peerRef.current = null;
      setIsConnected(false);
    };
    // Run only once on mount
  }, []);

  // Setup WebSocket event listeners
  const setupSignaling = (stream: MediaStream) => {
    if (!socketRef.current) return;

    socketRef.current.onopen = () => {
      console.log("WebSocket Connected");
      // Send a message to join the specific meeting room
      const joinMsg: JoinMessage = { type: 'join', meetingId, userId };
      console.log('Sending join message:', joinMsg);
      socketRef.current?.send(JSON.stringify(joinMsg));

      // --- Initialize Peer AFTER joining the room --- //
      // It's often better to initialize the peer only when the server confirms
      // another participant is present or when joining is confirmed.
      // For simplicity here, we initialize immediately, assuming the server
      // handles buffering signals if the other peer isn't ready yet.
      console.log("Initializing Peer...");
      initializePeer(stream, isInitiator);
      // ------------------------------------------------ //
    };

    socketRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as WebSocketMessage;
        console.log('Received message:', message);

        // Ignore messages from self
        if (message.userId === userId) {
          console.log("Ignoring self-message");
          return;
        }

        if (message.type === 'signal' && message.signal) {
          if (peerRef.current) {
            console.log("Received signal from peer, applying...");
            peerRef.current.signal(message.signal);
          } else {
             console.warn("Received signal but peer is not initialized yet.");
             // TODO: Potentially buffer the signal if peer initializes later
          }
        }
        // TODO: Handle other message types from server (e.g., user joined/left notifications)

      } catch (error) {
        console.error("Failed to parse message or invalid message format:", event.data, error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
      // Consider adding user feedback or reconnection logic
    };

    socketRef.current.onclose = (event) => {
      console.log("WebSocket Disconnected:", event.reason);
      setIsConnected(false);
      // Consider cleanup or attempting to reconnect
    };
  };

  // Initialize simple-peer
  const initializePeer = (stream: MediaStream, initiator: boolean) => {
    // Destroy existing peer if any
    peerRef.current?.destroy();

    console.log(`Initializing Peer as ${initiator ? 'initiator' : 'receiver'}`);
    const newPeer = new Peer({
      initiator: initiator,
      trickle: true, // Use trickle ICE for faster connection setup
      stream: stream,
      // Consider adding STUN servers for NAT traversal
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    // --- Send Signal Data via WebSocket --- //
    newPeer.on("signal", (data) => {
      console.log("Generated signal:", data.type);
      const signalMsg: SignalMessage = {
        type: 'signal',
        userId,
        meetingId,
        signal: data,
      };
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log("Sending signal to server...");
        socketRef.current.send(JSON.stringify(signalMsg));
      } else {
        console.warn("WebSocket not open. Cannot send signal.");
      }
    });
    // --------------------------------------- //

    newPeer.on("connect", () => {
      console.log("PEER CONNECTED");
      setIsConnected(true);
      // You can now send data through the peer connection if needed
      // newPeer.send("Hello from " + userId);
    });

    newPeer.on("stream", (remoteStream) => {
      console.log("Remote stream received");
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    newPeer.on("close", () => {
      console.log("Peer connection closed");
      setRemoteStream(null);
      setIsConnected(false);
      // Maybe attempt re-initialization or notify user
      if (peerRef.current === newPeer) {
          peerRef.current = null;
          setPeer(null);
      }
    });

    newPeer.on("error", (err) => {
      console.error("Peer error:", err);
      setIsConnected(false);
      // Attempt to cleanup and maybe re-initialize or notify user
       if (peerRef.current === newPeer) {
          peerRef.current?.destroy(); // Ensure cleanup on error
          peerRef.current = null;
          setPeer(null);
      }
    });

    setPeer(newPeer);
    peerRef.current = newPeer; // Store in ref
  };

  const handleLeave = () => {
    console.log("handleLeave called");
    localStream?.getTracks().forEach((track) => track.stop());
    peerRef.current?.destroy();
    socketRef.current?.close(); // Close WebSocket connection
    setLocalStream(null);
    setRemoteStream(null);
    setPeer(null);
    peerRef.current = null;
    setIsConnected(false);
    // TODO: Navigate away or show a "left meeting" state
    console.log("Left meeting");
    // window.location.href = '/'; // Example navigation
  };

  console.log("MeetingRoomPage: Rendering component...");
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Remove test heading */}
      {/* <h1>COMPONENT RENDER TEST</h1> */}
      <header className="h-16 bg-gray-800 px-4 flex items-center justify-between border-b border-gray-700">
        <div className="font-bold text-xl">MentorSpark Meeting (ID: {meetingId})</div>
        {/* Display connection status indicator? */}
        <span className={`text-sm px-2 py-1 rounded ${isConnected ? 'bg-green-600' : 'bg-yellow-600'}`}>
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
        <Button
          variant="destructive"
          onClick={handleLeave}
        >
          Leave Meeting
        </Button>
      </header>
      {/* Replace MeetingRoom component or integrate videos within it */}
      {/* <MeetingRoom /> */}
      <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Remove test heading */}
         {/* <h2>Video Placeholders</h2> */}
         {/* Re-enable Local Video */}
         <div className="bg-gray-800 rounded-lg overflow-hidden relative aspect-video">
           {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">
               Requesting camera...
             </div>
           )}
             <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                You ({userId})
             </div>
         </div>

         {/* Re-enable Remote Video */}
         <div className="bg-gray-800 rounded-lg overflow-hidden relative aspect-video">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {isConnected ? 'Waiting for participant stream...' : 'Waiting for participant connection...'}
              </div>
            )}
             <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                Participant
             </div>
         </div>
      </div>
       {/* TODO: Add call controls (mute/unmute, video on/off) here */}
    </div>
  );
};

export default MeetingRoomPage;
