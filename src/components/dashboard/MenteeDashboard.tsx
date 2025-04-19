import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Star, Search, ChevronRight, Mic, MicOff, VideoOff, MessageSquare, X, BookOpen, FileText, FileCheck2 } from "lucide-react";
import { MentorCard } from "@/components/explore/MentorCard";
import { mentors } from "@/data/mentors";

export function MenteeDashboard() {
  // Recommended mentors (first 3 from the mock data)
  const recommendedMentors = mentors.slice(0, 3);

  // Dummy data
  const upcomingSessions = [
    {
      id: "1",
      title: "System Design Interview Preparation",
      mentor: "Dr. Emily Chen",
      mentorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "April 15, 2025",
      time: "7:00 PM EST",
    },
    {
      id: "2",
      title: "Data Science Portfolio Workshop",
      mentor: "Aisha Patel",
      mentorAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
      date: "April 18, 2025",
      time: "8:00 PM EST",
    },
  ];

  // Add resources/assignments/assessments for ongoing mentorships
  const activeMentorships = [
    {
      id: "1",
      mentor: "Michael Johnson",
      title: "Product Manager at Spotify",
      startDate: "March 15, 2025",
      nextSession: "April 16, 2025",
      progress: 40,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      resources: [
        {
          type: "resource",
          title: "Product Management 101 Slides",
          link: "#",
        },
        {
          type: "assignment",
          title: "Case Study: Spotify Growth",
          link: "#",
          due: "April 20, 2025",
          status: "pending",
        },
        {
          type: "assessment",
          title: "Quiz: Product Metrics",
          link: "#",
          status: "completed",
        },
      ],
    },
    {
      id: "2",
      mentor: "Sofia Rodriguez",
      title: "UX/UI Designer at Airbnb",
      startDate: "February 20, 2025",
      nextSession: "April 14, 2025",
      progress: 75,
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      resources: [
        {
          type: "resource",
          title: "UX Design Principles PDF",
          link: "#",
        },
        {
          type: "assignment",
          title: "Redesign Airbnb Homepage",
          link: "#",
          due: "April 22, 2025",
          status: "pending",
        },
      ],
    },
  ];

  const pendingRequests = [
    {
      id: "1",
      mentor: "Dr. Emily Chen",
      title: "Senior Software Engineer at Google",
      requestDate: "April 9, 2025",
      status: "pending",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  // Video call UI states
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

  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Ensure video element always gets the stream
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

  const handleSendMessage = () => {
    if (chatInput.trim() !== "") {
      setChatMessages([...chatMessages, { sender: "You", message: chatInput }]);
      setChatInput("");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in bg-gradient-to-br from-gray-50 to-white min-h-screen pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mentee-primary mb-1">Welcome back, Mentee!</h1>
          <p className="text-muted-foreground text-base">Track your mentorship journey, join sessions, and access resources.</p>
        </div>
        <Button className="bg-mentee-primary hover:bg-mentee-secondary shadow-md">
          <Search className="h-4 w-4 mr-2" />
          Find Mentors
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-white/90">
          <CardHeader className="pb-2">
            <CardDescription>Active Mentorships</CardDescription>
            <CardTitle className="text-3xl">{activeMentorships.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next session on {activeMentorships[0].nextSession}</span>
              <Video className="h-4 w-4 text-mentee-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-white/90">
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Sessions</CardDescription>
            <CardTitle className="text-3xl">{upcomingSessions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next: {upcomingSessions[0].date}</span>
              <Calendar className="h-4 w-4 text-mentee-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-white/90">
          <CardHeader className="pb-2">
            <CardDescription>Pending Requests</CardDescription>
            <CardTitle className="text-3xl">{pendingRequests.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Awaiting response</span>
              <Clock className="h-4 w-4 text-mentee-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active-mentorships" className="w-full">
        <TabsList className="mb-6 bg-white/80 shadow-sm rounded-lg">
          <TabsTrigger value="active-mentorships">Active Mentorships</TabsTrigger>
          <TabsTrigger value="upcoming-sessions">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="pending-requests">Pending Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active-mentorships" className="space-y-8">
          {activeMentorships.map((mentorship) => (
            <Card key={mentorship.id} className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50">
              <div className="flex flex-col md:flex-row items-start md:items-center p-6 gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-mentee-primary shadow">
                  <img src={mentorship.avatar} alt={mentorship.mentor} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{mentorship.mentor}</h3>
                  <p className="text-sm text-muted-foreground">{mentorship.title}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm mt-1">
                    <p className="text-muted-foreground">Started {mentorship.startDate}</p>
                    <div className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground"></div>
                    <p>Next session: <span className="text-mentee-primary">{mentorship.nextSession}</span></p>
                  </div>
                  {/* Resources/Assignments/Assessments */}
                  <div className="mt-4 space-y-2">
                    {mentorship.resources && mentorship.resources.length > 0 && (
                      <div>
                        <div className="font-semibold text-base mb-2 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-mentee-primary" />
                          Mentor Resources & Assignments
                        </div>
                        <ul className="space-y-2">
                          {mentorship.resources.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                              {item.type === "resource" && <FileText className="h-5 w-5 text-blue-500" />}
                              {item.type === "assignment" && <FileCheck2 className="h-5 w-5 text-yellow-500" />}
                              {item.type === "assessment" && <Star className="h-5 w-5 text-green-500" />}
                              <div className="flex-1">
                                <a href={item.link} className="font-medium hover:underline" target="_blank" rel="noopener noreferrer">{item.title}</a>
                                {item.type === "assignment" && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    Due: {item.due}
                                  </span>
                                )}
                              </div>
                              {item.type === "assignment" && (
                                <Badge variant={item.status === "pending" ? "outline" : "default"} className={item.status === "pending" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-green-100 text-green-700 border-green-300"}>
                                  {item.status === "pending" ? "Pending" : "Completed"}
                                </Badge>
                              )}
                              {item.type === "assessment" && (
                                <Badge variant={item.status === "completed" ? "default" : "outline"} className={item.status === "completed" ? "bg-green-100 text-green-700 border-green-300" : "bg-yellow-100 text-yellow-700 border-yellow-300"}>
                                  {item.status === "completed" ? "Completed" : "Pending"}
                                </Badge>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 items-end min-w-[160px]">
                  <div className="w-full flex items-center gap-2">
                    <div className="w-32 bg-muted-foreground/20 rounded-full h-2">
                      <div
                        className="bg-mentee-primary h-2 rounded-full"
                        style={{ width: `${mentorship.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{mentorship.progress}%</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      className="bg-mentee-primary hover:bg-mentee-secondary"
                      onClick={() => setVideoModalOpen(true)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="upcoming-sessions" className="space-y-8">
          {upcomingSessions.map((session) => (
            <Card key={session.id} className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-mentee-primary shadow">
                    <img src={session.mentorAvatar} alt={session.mentor} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">with {session.mentor}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-mentee-primary hover:bg-mentee-secondary"
                    onClick={() => setVideoModalOpen(true)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Session
                  </Button>
                  <Button variant="outline">Reschedule</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="pending-requests" className="space-y-8">
          {pendingRequests.map((request) => (
            <Card key={request.id} className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-mentee-primary shadow">
                    <img src={request.avatar} alt={request.mentor} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">{request.mentor}</h3>
                    <p className="text-sm text-muted-foreground">{request.title}</p>
                    <p className="text-sm mt-1">
                      Requested on {request.requestDate} • 
                      <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-300">
                        Pending
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Cancel Request</Button>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Recommended Mentors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
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
                    {mediaPermission === "granted" && videoEnabled ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover bg-black"
                        style={{ borderRadius: 0 }}
                      />
                    ) : mediaPermission === "granted" && !videoEnabled ? (
                      <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                        <VideoOff className="w-20 h-20 mb-4" />
                        <span className="text-lg">Camera is Off</span>
                      </div>
                    ) : null}
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
                            ? "ml-auto bg-mentee-primary text-white"
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
                      className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-mentee-primary"
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
                className={`rounded-full px-6 py-3 shadow-lg text-lg ${showChat ? "bg-mentee-primary text-white" : "bg-white text-black hover:bg-gray-200"}`}
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
