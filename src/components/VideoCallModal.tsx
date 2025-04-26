// components/VideoCallModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video as VideoIcon, VideoOff, X, Send } from "lucide-react";
import { OpenVidu } from "openvidu-browser";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoCallModal({ isOpen, onClose }: VideoCallModalProps) {
  const [session, setSession] = useState<any>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Replace with your OpenVidu server URL and secret
  const OPENVIDU_SERVER_URL = "http://localhost:4443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET"; // default is MY_SECRET

  // Helper to get a token from your OpenVidu server
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

  // Join OpenVidu session when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Cleanup on close
      if (session) {
        session.disconnect();
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
      }
      setHasPermission(false);
      return;
    }

    const OV = new OpenVidu();
    let mySession: any;
    let myPublisher: any;

    (async () => {
      try {
        const token = await getToken("MentorSessionDemo");
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
          publishAudio: micOn,
          publishVideo: videoOn,
          resolution: "1280x720",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: true,
        });

        mySession.publish(myPublisher);
        setSession(mySession);
        setPublisher(myPublisher);
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
        alert("Could not connect to OpenVidu server. Is it running?");
      }
    })();

    // Cleanup on unmount
    return () => {
      if (mySession) mySession.disconnect();
    };
    // eslint-disable-next-line
  }, [isOpen]);

  // Toggle mic
  const handleToggleMic = () => {
    setMicOn((v) => {
      const newMicOn = !v;
      if (publisher) publisher.publishAudio(newMicOn);
      return newMicOn;
    });
  };

  // Toggle video
  const handleToggleVideo = () => {
    setVideoOn((v) => {
      const newVideoOn = !v;
      if (publisher) publisher.publishVideo(newVideoOn);
      return newVideoOn;
    });
  };

  // Chat send (local only, for demo)
  const handleSend = () => {
    if (chatInput.trim()) {
      setChatMessages((msgs) => [...msgs, chatInput]);
      setChatInput("");
    }
  };

  // Attach local video element to publisher when both are ready
  useEffect(() => {
    if (publisher && localVideoRef.current) {
      publisher.addVideoElement(localVideoRef.current);
    }
  }, [publisher, localVideoRef]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-full max-h-full p-0 flex flex-col bg-gray-900 text-white rounded-none">
        <div className="flex flex-col md:flex-row flex-1 h-full">
          {/* Video Section */}
          <div className="flex-1 flex flex-col items-center justify-center relative bg-black">
            <DialogHeader className="absolute top-0 left-0 w-full flex flex-row items-center justify-between p-4 z-10 bg-black/60">
              <DialogTitle className="text-2xl flex items-center gap-2">
                Video Conference
              </DialogTitle>
              <Button variant="ghost" onClick={onClose} className="text-white">
                <X className="w-6 h-6" />
              </Button>
            </DialogHeader>
            {!hasPermission ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg mb-4">Connecting to video conference...</p>
              </div>
            ) : (
              <div className="flex-1 w-full h-full flex justify-center items-center">
                {/* Local video */}
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover bg-gray-800"
                  style={{ minHeight: 0, minWidth: 0 }}
                />
                {/* Remote videos (if any) */}
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
            )}
            {/* Controls */}
            {hasPermission && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                <Button
                  variant={micOn ? "secondary" : "destructive"}
                  onClick={handleToggleMic}
                  className="rounded-full w-12 h-12 flex items-center justify-center"
                >
                  {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>
                <Button
                  variant={videoOn ? "secondary" : "destructive"}
                  onClick={handleToggleVideo}
                  className="rounded-full w-12 h-12 flex items-center justify-center"
                >
                  {videoOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
                <Button
                  variant="destructive"
                  onClick={onClose}
                  className="rounded-full w-12 h-12 flex items-center justify-center"
                  title="End Call"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            )}
          </div>
          {/* Chat Section */}
          <div className="w-full md:w-96 flex flex-col border-l border-gray-800 bg-gray-950 h-full">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center mt-8">No messages yet.</div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg px-3 py-2 text-sm">
                    {msg}
                  </div>
                ))
              )}
            </div>
            <form
              className="flex gap-2 p-4 border-t border-gray-800"
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                className="flex-1 rounded bg-gray-800 text-white px-3 py-2 outline-none"
                placeholder="Type a message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <Button type="submit" variant="secondary" className="px-3 py-2">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

