import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, BookOpen, MessageSquare, Users, ChevronRight, Plus, User, X, Mic, MicOff, VideoOff, Image as ImageIcon, Droplet } from "lucide-react";

export function MentorDashboard() {
  const [activeSessions, setActiveSessions] = useState(3);
  const [pendingRequests, setPendingRequests] = useState(2);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "You", message: "Welcome to the session!" }
  ]);
  const [mediaPermission, setMediaPermission] = useState<"pending" | "granted" | "denied">("pending");
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [backgroundMode, setBackgroundMode] = useState<"none" | "blur" | "image">("none");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Request media permissions when modal opens
  useEffect(() => {
    if (videoModalOpen) {
      setMediaPermission("pending");
      setMediaError(null);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMediaPermission("granted");
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          setMediaPermission("denied");
          setMediaError(err.message || "Permission denied");
        });
    } else {
      // Stop all tracks when modal closes
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
  }, [videoModalOpen]);

  useEffect(() => {
    if (videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [mediaPermission, videoEnabled, videoModalOpen]);

  // Toggle video track
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = videoEnabled;
      });
    }
  }, [videoEnabled]);

  // Toggle audio track
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = micEnabled;
      });
    }
  }, [micEnabled]);

  // Effect for background blur or image
  useEffect(() => {
    let animationFrame: number;
    if (
      videoRef.current &&
      canvasRef.current &&
      mediaPermission === "granted" &&
      videoEnabled &&
      backgroundMode !== "none"
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const drawFrame = () => {
        if (ctx && video.readyState === 4) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (backgroundMode === "blur") {
            // Blur background using CSS filter
            ctx.globalCompositeOperation = "destination-over";
            ctx.filter = "blur(16px)";
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.filter = "none";
            ctx.globalCompositeOperation = "source-over";
          } else if (backgroundMode === "image" && backgroundImage) {
            // Draw background image
            const img = new window.Image();
            img.src = backgroundImage;
            img.onload = () => {
              ctx.globalCompositeOperation = "destination-over";
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              ctx.globalCompositeOperation = "source-over";
            };
          }
        }
        animationFrame = requestAnimationFrame(drawFrame);
      };
      drawFrame();
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [mediaPermission, videoEnabled, backgroundMode, backgroundImage]);

  const handleSendMessage = () => {
    if (chatInput.trim() !== "") {
      setChatMessages([...chatMessages, { sender: "You", message: chatInput }]);
      setChatInput("");
    }
  };

  // Handler for background image upload
  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(URL.createObjectURL(e.target.files[0]));
      setBackgroundMode("image");
    }
  };

  // Dummy data
  const upcomingSessions = [
    {
      id: "1",
      title: "System Design Interview Preparation",
      date: "April 15, 2025",
      time: "7:00 PM EST",
      attendees: 12,
    },
    {
      id: "2",
      title: "Building Your Portfolio for Tech Roles",
      date: "April 20, 2025",
      time: "6:00 PM EST",
      attendees: 8,
    },
  ];

  const menteeRequests = [
    {
      id: "1",
      name: "David Kim",
      interests: ["Web Development", "JavaScript"],
      message: "I'd love to learn more about front-end development and career advancement in the field.",
      date: "April 10, 2025",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    {
      id: "2",
      name: "Priya Singh",
      interests: ["Data Science", "Machine Learning"],
      message: "I'm transitioning from software engineering to data science and would appreciate your guidance.",
      date: "April 9, 2025",
      avatar: "https://randomuser.me/api/portraits/women/53.jpg",
    },
  ];

  const activeMentorships = [
    {
      id: "1",
      mentee: "Jason Martinez",
      startDate: "February 15, 2025",
      nextSession: "April 18, 2025",
      progress: 65,
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    {
      id: "2",
      mentee: "Maria Garcia",
      startDate: "March 1, 2025",
      nextSession: "April 16, 2025",
      progress: 40,
      avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    },
    {
      id: "3",
      mentee: "Kevin Li",
      startDate: "March 10, 2025",
      nextSession: "April 17, 2025",
      progress: 30,
      avatar: "https://randomuser.me/api/portraits/men/74.jpg",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Mentor Dashboard</h1>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Video className="h-4 w-4 mr-2" />
            Create Live Session
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Mentorships</CardDescription>
            <CardTitle className="text-3xl">{activeSessions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">4 sessions this week</span>
              <Users className="h-4 w-4 text-mentor-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Requests</CardDescription>
            <CardTitle className="text-3xl">{pendingRequests}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">2 new this week</span>
              <Users className="h-4 w-4 text-mentor-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Next Live Session</CardDescription>
            <CardTitle className="text-lg sm:text-xl truncate">{upcomingSessions[0].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-mentor-primary" />
                <span>{upcomingSessions[0].date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-mentor-primary" />
                <span>{upcomingSessions[0].time}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="mentorship-requests" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="mentorship-requests" className="flex-1 sm:flex-none">Mentorship Requests</TabsTrigger>
          <TabsTrigger value="active-mentorships" className="flex-1 sm:flex-none">Active Mentorships</TabsTrigger>
          <TabsTrigger value="upcoming-sessions" className="flex-1 sm:flex-none">Upcoming Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mentorship-requests" className="space-y-6">
          {menteeRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img src={request.avatar} alt={request.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-medium text-lg mb-1">{request.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Requested on {request.date}</p>
                    <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                      {request.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="bg-mentor-soft/50">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm">{request.message}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t md:border-t-0 md:border-l flex flex-row md:flex-col items-center justify-center gap-3">
                  <Button className="flex-1 w-full">Accept</Button>
                  <Button variant="outline" className="flex-1 w-full">Decline</Button>
                  <Button variant="ghost" size="sm" className="w-full">View Profile</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="active-mentorships" className="space-y-6">
          {activeMentorships.map((mentorship) => (
            <Card key={mentorship.id}>
              <div className="flex flex-col sm:flex-row items-center p-4 sm:p-6 gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={mentorship.avatar} alt={mentorship.mentee} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-medium">{mentorship.mentee}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                    <p className="text-muted-foreground">Started {mentorship.startDate}</p>
                    <div className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground"></div>
                    <p>Next session: <span className="text-mentor-primary">{mentorship.nextSession}</span></p>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <div className="w-full sm:w-32 bg-muted-foreground/20 rounded-full h-2">
                    <div
                      className="bg-mentor-primary h-2 rounded-full"
                      style={{ width: `${mentorship.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm min-w-[40px] text-right">{mentorship.progress}%</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="upcoming-sessions" className="space-y-6">
          {upcomingSessions.map((session) => (
            <Card key={session.id}>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{session.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{session.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      className="flex-1 sm:flex-none"
                      onClick={() => setVideoModalOpen(true)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">Edit</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <div className="flex justify-center">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Session
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Call Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <div className="absolute inset-0 w-full h-full flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-b from-black/80 to-transparent z-10">
              <div className="flex items-center gap-3">
                <Video className="h-6 w-6 text-white" />
                <span className="text-white font-semibold text-lg">Live Session</span>
              </div>
              <button
                className="text-gray-300 hover:text-white transition"
                onClick={() => setVideoModalOpen(false)}
                aria-label="Close"
              >
                <X className="h-7 w-7" />
              </button>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-row relative overflow-hidden">
              {/* Video Section */}
              <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${showChat ? "hidden md:flex" : "flex"}`}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden rounded-none shadow-none border-none">
                    {mediaPermission === "pending" && (
                      <div className="flex flex-col items-center justify-center w-full h-full text-white">
                        <span className="text-lg mb-2">Requesting camera and microphone access...</span>
                        <span className="text-sm text-gray-300">Please allow access to start your video call.</span>
                      </div>
                    )}
                    {mediaPermission === "denied" && (
                      <div className="flex flex-col items-center justify-center w-full h-full text-red-400">
                        <VideoOff className="w-20 h-20 mb-4" />
                        <span className="text-lg">Permission denied</span>
                        <span className="text-sm">{mediaError}</span>
                      </div>
                    )}
                    {mediaPermission === "granted" && (
                      videoEnabled ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover bg-black"
                          style={{ borderRadius: 0 }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                          <VideoOff className="w-20 h-20 mb-4" />
                          <span className="text-lg">Camera is Off</span>
                        </div>
                      )
                    )}
                    {/* Mini self-view (bottom right) */}
                    {mediaPermission === "granted" && (
                      <div className="absolute bottom-6 right-6 w-32 h-24 rounded-lg overflow-hidden border-2 border-white bg-black/70 flex items-center justify-center shadow-lg">
                        <img
                          src="https://randomuser.me/api/portraits/men/36.jpg"
                          alt="You"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Chat Section */}
              {showChat && (
                <div className="w-full md:w-96 h-full bg-white flex flex-col border-l border-gray-200 shadow-2xl z-20">
                  <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <span className="font-semibold text-gray-800">Meeting Chat</span>
                    <button
                      className="text-gray-400 hover:text-gray-700"
                      onClick={() => setShowChat(false)}
                      aria-label="Close Chat"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`text-sm rounded-lg px-3 py-2 max-w-[80%] ${
                          msg.sender === "You"
                            ? "ml-auto bg-mentor-primary text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <span className="font-semibold">{msg.sender}: </span>
                        <span>{msg.message}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t flex gap-2 bg-white">
                    <input
                      className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-mentor-primary"
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                    />
                    <Button size="sm" onClick={handleSendMessage}>Send</Button>
                  </div>
                </div>
              )}
            </div>
            {/* Controls */}
            <div className="w-full flex flex-wrap justify-center items-center gap-4 py-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 z-10">
              <Button
                className={`rounded-full px-6 py-3 shadow-lg text-lg ${videoEnabled ? "bg-white text-black hover:bg-gray-200" : "bg-gray-700 text-white"}`}
                onClick={() => setVideoEnabled(v => !v)}
                aria-label={videoEnabled ? "Turn off video" : "Turn on video"}
                disabled={mediaPermission !== "granted"}
              >
                {videoEnabled ? <Video className="h-6 w-6 mr-2" /> : <VideoOff className="h-6 w-6 mr-2" />}
                {videoEnabled ? "Stop Video" : "Start Video"}
              </Button>
              <Button
                className={`rounded-full px-6 py-3 shadow-lg text-lg ${micEnabled ? "bg-white text-black hover:bg-gray-200" : "bg-gray-700 text-white"}`}
                onClick={() => setMicEnabled(m => !m)}
                aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
                disabled={mediaPermission !== "granted"}
              >
                {micEnabled ? <Mic className="h-6 w-6 mr-2" /> : <MicOff className="h-6 w-6 mr-2" />}
                {micEnabled ? "Mute" : "Unmute"}
              </Button>
              <Button
                className={`rounded-full px-6 py-3 shadow-lg text-lg ${showChat ? "bg-mentor-primary text-white" : "bg-white text-black hover:bg-gray-200"}`}
                onClick={() => setShowChat(c => !c)}
                aria-label="Open chat"
              >
                <MessageSquare className="h-6 w-6 mr-2" />
                Chat
              </Button>
              <Button
                className="rounded-full px-6 py-3 shadow-lg text-lg bg-red-600 text-white hover:bg-red-700"
                onClick={() => setVideoModalOpen(false)}
              >
                <Video className="h-6 w-6 mr-2" />
                End Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
