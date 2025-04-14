
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mentor } from "@/data/mentors";
import { interests } from "@/data/interests";
import { Calendar, MessageSquare, Video, Clock, Star, Flag } from "lucide-react";

interface MentorProfileProps {
  mentor: Mentor;
  onRequestMentorship: () => void;
}

export function MentorProfile({ mentor, onRequestMentorship }: MentorProfileProps) {
  const getInterestNames = () => {
    return mentor.interests.map(id => {
      const interest = interests.find(i => i.id === id);
      return interest ? interest.name : "";
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-0">
              <div className="relative h-48 bg-gradient-to-r from-mentor-primary/30 to-mentor-light/30">
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                  <div className="mr-6">
                    <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden">
                      <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{mentor.name}</h1>
                    <p className="text-muted-foreground">{mentor.title}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-16">
              <div className="flex flex-wrap gap-2 mb-6">
                {getInterestNames().map((interest, index) => (
                  <Badge key={index} variant="outline" className="bg-mentor-soft/50">
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium">{mentor.rating} rating</p>
                    <p className="text-xs text-muted-foreground">{mentor.reviewCount} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-mentor-primary" />
                  <div>
                    <p className="font-medium">${mentor.hourlyRate}/hour</p>
                    <p className="text-xs text-muted-foreground">Mentorship rate</p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="about">
                <TabsList className="mb-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">About Me</h3>
                    <p className="text-muted-foreground">{mentor.about}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="qualifications" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Education</h3>
                    <p className="text-muted-foreground mb-1">High School: {mentor.qualifications.highSchool}</p>
                    <p className="text-muted-foreground">{mentor.qualifications.graduation}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Achievements</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {mentor.qualifications.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Experience</h3>
                    <p className="text-muted-foreground">{mentor.qualifications.experience}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Mentorship Experience</h3>
                    <p className="text-muted-foreground">{mentor.qualifications.mentorshipExperience}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="availability" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Available Days</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.availability.days.map((day, index) => (
                        <Badge key={index} variant="outline" className="bg-mentor-soft/50">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Available Hours</h3>
                    <p className="text-muted-foreground">{mentor.availability.hours}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button className="w-full bg-mentor-primary hover:bg-mentor-secondary" onClick={onRequestMentorship}>
                  Request Mentorship
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {mentor.upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {mentor.upcomingSessions.map((session, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-1">{session.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{session.description}</p>
                      <div className="flex justify-between text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-mentor-primary" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-mentor-primary" />
                          <span>{session.time}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Video className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No upcoming sessions</p>
              )}
            </CardContent>
          </Card>
          
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
            <Flag className="h-4 w-4 mr-2" />
            Report this mentor
          </Button>
        </div>
      </div>
    </div>
  );
}
