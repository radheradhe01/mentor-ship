import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";

export function MeetingRoom() {
  const [session, setSession] = useState<any>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();

  // Get sessionId from URL
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("sessionId") || "MentorSessionDemo";

  const OPENVIDU_SERVER_URL = "http://localhost:4443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET";

  async function getToken(sessionId: string) {
    const response = await fetch(OPENVIDU_SERVER_URL + "/api/sessions", {
      method: "POST",
      body: JSON.stringify({ customSessionId: sessionId }),
      headers: {
        Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
        "Content-Type": "application/json",
      },
    });
    const sessionData = await response.json();
    const sessionIdReturned = sessionData.id;

    const tokenResponse = await fetch(OPENVIDU_SERVER_URL + "/api/tokens", {
      method: "POST",
      body: JSON.stringify({ session: sessionIdReturned }),
      headers: {
        Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
        "Content-Type": "application/json",
      },
    });
    const tokenData = await tokenResponse.json();
    return tokenData.token;
  }

  useEffect(() => {
    const OV = new OpenVidu();
    let mySession: any;
    let myPublisher: any;

    (async () => {
      try {
        const token = await getToken(sessionId);
        mySession = OV.initSession();

        mySession.on("streamCreated", (event: any) => {
          const subscriber = mySession.subscribe(event.stream, undefined);
          setSubscribers((subs) => [...subs, subscriber]);
        });

        mySession.on("streamDestroyed", (event: any) => {
          setSubscribers((subs) => subs.filter((s) => s !== event.stream.streamManager));
        });

        await mySession.connect(token);

        myPublisher = OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: "1280x720",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: true,
        });

        mySession.publish(myPublisher);
        setSession(mySession);
        setPublisher(myPublisher);

        // Attach local video
        if (localVideoRef.current) {
          myPublisher.addVideoElement(localVideoRef.current);
        }
      } catch (err) {
        alert("Could not connect to OpenVidu server. Is it running?");
      }
    })();

    return () => {
      if (mySession) mySession.disconnect();
    };
    // eslint-disable-next-line
  }, [sessionId]);

  useEffect(() => {
    if (publisher && localVideoRef.current) {
      publisher.addVideoElement(localVideoRef.current);
    }
  }, [publisher, localVideoRef]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black">
      <div className="flex flex-wrap gap-4 justify-center items-center w-full h-full p-8">
        {/* Local video */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="rounded-lg overflow-hidden bg-gray-800 w-[320px] h-[240px]"
        />
        {/* Remote videos */}
        {subscribers.map((sub, idx) => {
          const remoteRef = (el: HTMLDivElement | null) => {
            if (el && sub && typeof sub.addVideoElement === "function") {
              sub.addVideoElement(el);
            }
          };
          return (
            <div
              key={idx}
              ref={remoteRef}
              className="rounded-lg overflow-hidden bg-gray-800 w-[320px] h-[240px]"
            />
          );
        })}
      </div>
    </div>
  );
}
