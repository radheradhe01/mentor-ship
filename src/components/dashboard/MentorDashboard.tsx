import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, BookOpen, MessageSquare, Users, ChevronRight, Plus, User } from "lucide-react";
import { VideoCallModal } from "@/components/VideoCallModal";

export function MentorDashboard() {
  const [activeSessions, setActiveSessions] = useState(3);
  const [pendingRequests, setPendingRequests] = useState(2);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const navigate = useNavigate();

  // When mentor starts session, set a flag in localStorage
  const handleStartSession = () => {
    localStorage.setItem("session_live", "true");
    navigate("/meeting-room?sessionId=MentorSessionDemo");
  };

  // When mentor ends session, clear the flag
  const handleCloseSession = () => {
    localStorage.removeItem("session_live");
    setIsVideoModalOpen(false);
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
                    <Button className="flex-1 sm:flex-none" onClick={handleStartSession}>
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
      <VideoCallModal isOpen={isVideoModalOpen} onClose={handleCloseSession} />
    </div>
  );
}
