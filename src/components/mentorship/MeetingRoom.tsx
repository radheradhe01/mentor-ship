
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  MessageSquare,
  Users,
  Share2,
  Settings,
  X,
} from "lucide-react";

export function MeetingRoom() {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  const toggleMic = () => setMicEnabled(!micEnabled);
  const toggleVideo = () => setVideoEnabled(!videoEnabled);
  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (participantsOpen) setParticipantsOpen(false);
  };
  const toggleParticipants = () => {
    setParticipantsOpen(!participantsOpen);
    if (chatOpen) setChatOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-4rem)] relative">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="md:col-span-2 flex flex-col">
          <div className="bg-gray-900 rounded-lg overflow-hidden flex-1 flex items-center justify-center relative">
            {videoEnabled ? (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-at-home-4791-large.mp4"
              ></video>
            ) : (
              <div className="bg-gray-800 rounded-full w-32 h-32 flex items-center justify-center text-4xl font-bold text-white">
                MS
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white py-1 px-3 rounded-md text-sm">
              Dr. Emily Chen (Mentor)
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="aspect-video flex-1 min-w-[200px] bg-gray-900 rounded-lg overflow-hidden relative">
              {videoEnabled ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-4727-large.mp4"
                ></video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold text-white">
                    LP
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white py-1 px-2 rounded-md text-xs">
                Liam Parker (You)
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bg-gray-900 rounded-lg overflow-hidden ${
            chatOpen || participantsOpen ? "block" : "hidden md:block"
          }`}
        >
          <Tabs defaultValue="shared-notes" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 bg-gray-800">
              <TabsTrigger value="shared-notes">Shared Notes</TabsTrigger>
              <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
            </TabsList>
            <TabsContent
              value="shared-notes"
              className="flex-1 p-4 overflow-auto"
            >
              <div className="bg-white rounded-md p-4 h-full text-black">
                <h3 className="font-bold mb-2">System Design Interview Notes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Discuss requirements gathering and clarification</li>
                  <li>
                    Outline high-level architecture (client, servers, databases)
                  </li>
                  <li>
                    API design considerations (REST vs GraphQL for this
                    application)
                  </li>
                  <li>Data model and database schema considerations</li>
                  <li>Scalability approaches (horizontal vs vertical)</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent
              value="whiteboard"
              className="flex-1 p-4 overflow-auto bg-white"
            >
              <div className="text-center text-gray-500">
                Whiteboard functionality would be implemented here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed JSX issue - removed 'jsx' property from style tag */}
      <style>
        {`
          .control-button {
            @apply bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 flex items-center justify-center transition-all;
          }
          .control-button.active {
            @apply bg-mentor-primary;
          }
          .control-button.danger {
            @apply bg-red-500 hover:bg-red-600;
          }
        `}
      </style>

      <div className="bg-gray-900 p-4 flex justify-center">
        <div className="flex space-x-4">
          <button
            className={`control-button ${micEnabled ? "active" : ""}`}
            onClick={toggleMic}
          >
            {micEnabled ? <Mic /> : <MicOff />}
          </button>
          <button
            className={`control-button ${videoEnabled ? "active" : ""}`}
            onClick={toggleVideo}
          >
            {videoEnabled ? <Video /> : <VideoOff />}
          </button>
          <button
            className="control-button"
            onClick={toggleChat}
          >
            <MessageSquare />
          </button>
          <button
            className="control-button"
            onClick={toggleParticipants}
          >
            <Users />
          </button>
          <button className="control-button">
            <Share2 />
          </button>
          <button className="control-button">
            <Settings />
          </button>
          <button className="control-button danger">
            <Phone className="rotate-[135deg]" />
          </button>
        </div>
      </div>

      {chatOpen && (
        <div className="absolute right-0 top-0 h-full w-full md:w-80 bg-gray-900 z-10 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Chat</h3>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm font-semibold mb-1">Dr. Emily Chen</div>
              <div className="text-sm">
                Let's start by discussing the basic components of system design interviews.
              </div>
            </div>
            <div className="bg-mentor-primary/20 rounded-lg p-3">
              <div className="text-sm font-semibold mb-1">You</div>
              <div className="text-sm">
                I'm particularly interested in how to approach scalability questions.
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-800">
            <div className="flex">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border-0 rounded-l-md px-3 py-2 text-white focus:outline-none"
              />
              <button className="bg-mentor-primary hover:bg-mentor-secondary rounded-r-md px-4">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {participantsOpen && (
        <div className="absolute right-0 top-0 h-full w-full md:w-80 bg-gray-900 z-10 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Participants (2)</h3>
            <button onClick={() => setParticipantsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-mentor-primary flex items-center justify-center text-white font-semibold mr-3">
                  EC
                </div>
                <div>
                  <div className="font-semibold">Dr. Emily Chen</div>
                  <div className="text-xs text-gray-400">Mentor</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-white">
                  <MicOff size={16} />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <VideoOff size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold mr-3">
                  LP
                </div>
                <div>
                  <div className="font-semibold">Liam Parker (You)</div>
                  <div className="text-xs text-gray-400">Mentee</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-white">
                  <Mic size={16} />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <Video size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
