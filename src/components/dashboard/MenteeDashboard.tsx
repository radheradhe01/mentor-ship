import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Star, Search, ChevronRight } from "lucide-react";
import { MentorCard } from "@/components/explore/MentorCard";
import { mentors } from "@/data/mentors";
import { VideoCallModal } from "@/components/VideoCallModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  
  const activeMentorships = [
    {
      id: "1",
      mentor: "Michael Johnson",
      title: "Product Manager at Spotify",
      startDate: "March 15, 2025",
      nextSession: "April 16, 2025",
      progress: 40,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "2",
      mentor: "Sofia Rodriguez",
      title: "UX/UI Designer at Airbnb",
      startDate: "February 20, 2025",
      nextSession: "April 14, 2025",
      progress: 75,
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [sessionLive, setSessionLive] = useState(false);
  const navigate = useNavigate();

  // Poll localStorage for session status (for demo; use real-time backend in prod)
  useEffect(() => {
    const checkSession = () => setSessionLive(localStorage.getItem("session_live") === "true");
    checkSession();
    const interval = setInterval(checkSession, 2000); // check every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mentee Dashboard</h1>
        <Button className="bg-mentee-primary hover:bg-mentee-secondary">
          <Search className="h-4 w-4 mr-2" />
          Find Mentors
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
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
        
        <Card>
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
        
        <Card>
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
      
      <Tabs defaultValue="active-mentorships">
        <TabsList className="mb-4">
          <TabsTrigger value="active-mentorships">Active Mentorships</TabsTrigger>
          <TabsTrigger value="upcoming-sessions">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="pending-requests">Pending Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active-mentorships" className="space-y-6">
          {activeMentorships.map((mentorship) => (
            <Card key={mentorship.id}>
              <div className="flex items-center p-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src={mentorship.avatar} alt={mentorship.mentor} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{mentorship.mentor}</h3>
                  <p className="text-sm text-muted-foreground">{mentorship.title}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm mt-1">
                    <p className="text-muted-foreground">Started {mentorship.startDate}</p>
                    <div className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground"></div>
                    <p>Next session: <span className="text-mentee-primary">{mentorship.nextSession}</span></p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 mx-4">
                  <div className="w-32 bg-muted-foreground/20 rounded-full h-2">
                    <div
                      className="bg-mentee-primary h-2 rounded-full"
                      style={{ width: `${mentorship.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{mentorship.progress}%</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="upcoming-sessions" className="space-y-6">
          {upcomingSessions.map((session) => (
            <Card key={session.id}>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={session.mentorAvatar} alt={session.mentor} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{session.title}</h3>
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
                    {sessionLive && (
                      <Button
                        className="bg-mentee-primary hover:bg-mentee-secondary"
                        onClick={() => navigate("/meeting-room?sessionId=MentorSessionDemo")}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    )}
                    <Button variant="outline">Reschedule</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="pending-requests" className="space-y-6">
          {pendingRequests.map((request) => (
            <Card key={request.id}>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
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
      <VideoCallModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </div>
  );
}
