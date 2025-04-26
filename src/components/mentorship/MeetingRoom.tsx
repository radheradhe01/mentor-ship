import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OpenVidu, Session, Publisher, Subscriber, StreamManager, StreamEvent, ExceptionEvent } from "openvidu-browser";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

// Helper function to parse clientData
const getUserNameFromStream = (streamManager: StreamManager): string => {
  try {
    const data = JSON.parse(streamManager.stream.connection.data.split('%/%')[0]);
    return data?.serverData || 'Participant';
  } catch (e) {
    return 'Participant';
  }
};

export function MeetingRoom() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [mySession, setMySession] = useState<Session | null>(null);
  const [myUserName, setMyUserName] = useState<string>(user?.name || user?.email || 'User');
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const params = new URLSearchParams(location.search);
  const sessionIdFromUrl = params.get("sessionId") || "MentorSessionDemo";
  const [sessionId, setSessionId] = useState(sessionIdFromUrl);

  const getToken = useCallback(async (sessionName: string): Promise<string> => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch("/sessions/get-token", {
      method: "POST",
      body: JSON.stringify({ session_name: sessionName }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Failed to get video token" }));
      throw new Error(errorData.detail || `Error fetching token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  }, []);

  const leaveSession = useCallback(() => {
    if (mySession) {
      mySession.disconnect();
    }
    setOV(null);
    setMySession(null);
    setPublisher(null);
    setSubscribers([]);
    navigate(-1);
  }, [mySession, navigate]);

  useEffect(() => {
    const openVidu = new OpenVidu();
    setOV(openVidu);

    const initializeSession = async () => {
      const session = openVidu.initSession();

      session.on("streamCreated", (event: StreamEvent) => {
        if (event.stream.connection.connectionId !== session.connection.connectionId) {
          const subscriber = session.subscribe(event.stream, undefined);
          setSubscribers((subs) => [...subs, subscriber]);
          console.log("Subscribed to:", getUserNameFromStream(subscriber));
        }
      });

      session.on("streamDestroyed", (event: StreamEvent) => {
        setSubscribers((subs) =>
          subs.filter((s) => s.stream.streamId !== event.stream.streamId)
        );
        console.log("Unsubscribed from:", getUserNameFromStream(event.stream.streamManager));
      });

      session.on("exception", (exception: ExceptionEvent) => {
        console.warn("OpenVidu exception:", exception);
      });

      try {
        const token = await getToken(sessionId);
        await session.connect(token, { clientData: myUserName });

        const pub = openVidu.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: isAudioEnabled,
          publishVideo: isVideoEnabled,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: true,
        });

        await session.publish(pub);

        setMySession(session);
        setPublisher(pub);

        if (localVideoRef.current) {
          pub.addVideoElement(localVideoRef.current);
        }

      } catch (error: any) {
        console.error("Error connecting to OpenVidu:", error);
        alert(`Could not connect to the session: ${error.message}`);
      }
    };

    initializeSession();

    return () => {
      if (mySession) {
        mySession.disconnect();
      }
      setOV(null);
      setMySession(null);
      setPublisher(null);
      setSubscribers([]);
    };
  }, [sessionId, getToken]);

  const toggleAudio = () => {
    if (publisher) {
      const enabled = !isAudioEnabled;
      publisher.publishAudio(enabled);
      setIsAudioEnabled(enabled);
    }
  };

  const toggleVideo = () => {
    if (publisher) {
      const enabled = !isVideoEnabled;
      publisher.publishVideo(enabled);
      setIsVideoEnabled(enabled);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full bg-black text-white p-4 flex-grow">
      <div className="flex flex-wrap gap-4 justify-center items-center w-full flex-grow overflow-auto">
        {publisher && (
          <div className="relative rounded-lg overflow-hidden bg-gray-800 w-full max-w-xs md:max-w-sm aspect-video">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
              {myUserName} (You)
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              {!isAudioEnabled && <MicOff size={16} className="text-red-500 bg-black/50 rounded-full p-0.5" />}
              {!isVideoEnabled && <VideoOff size={16} className="text-red-500 bg-black/50 rounded-full p-0.5" />}
            </div>
          </div>
        )}

        {subscribers.map((sub) => (
          <div key={sub.stream.streamId} className="relative rounded-lg overflow-hidden bg-gray-800 w-full max-w-xs md:max-w-sm aspect-video">
            <RemoteVideo subscriber={sub} />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
              {getUserNameFromStream(sub)}
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              {!sub.stream.audioActive && <MicOff size={16} className="text-red-500 bg-black/50 rounded-full p-0.5" />}
              {!sub.stream.videoActive && <VideoOff size={16} className="text-red-500 bg-black/50 rounded-full p-0.5" />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 p-4 mt-4 bg-gray-900/50 rounded-lg">
        <Button onClick={toggleAudio} variant="outline" size="icon" className={`rounded-full ${isAudioEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'} text-white border-none`}>
          {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </Button>
        <Button onClick={toggleVideo} variant="outline" size="icon" className={`rounded-full ${isVideoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'} text-white border-none`}>
          {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </Button>
        <Button onClick={leaveSession} variant="destructive" size="icon" className="rounded-full bg-red-600 hover:bg-red-500 border-none">
          <PhoneOff size={20} />
        </Button>
      </div>
    </div>
  );
}

const RemoteVideo = ({ subscriber }: { subscriber: Subscriber }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (subscriber && videoRef.current) {
      subscriber.addVideoElement(videoRef.current);
    }
    return () => {};
  }, [subscriber]);

  return <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />;
};
