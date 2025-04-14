
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mentor } from "@/data/mentors";
import { interests } from "@/data/interests";
import { Calendar, MessageSquare } from "lucide-react";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const getInterestNames = () => {
    return mentor.interests.map(id => {
      const interest = interests.find(i => i.id === id);
      return interest ? interest.name : "";
    });
  };

  return (
    <Card className="overflow-hidden hover-scale">
      <CardHeader className="p-0">
        <div className="relative h-40 bg-gradient-to-r from-mentor-primary/30 to-mentor-light/30">
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end">
            <div className="mr-4">
              <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden">
                <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">{mentor.title}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">{mentor.rating}</span>
              <span className="text-sm text-muted-foreground">({mentor.reviewCount})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {getInterestNames().map((interest, index) => (
              <Badge key={index} variant="outline" className="bg-mentor-soft/50">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{mentor.about}</p>
        {mentor.upcomingSessions.length > 0 && (
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-mentor-primary" />
              <h4 className="text-sm font-medium">Upcoming Session</h4>
            </div>
            <p className="text-sm font-medium">{mentor.upcomingSessions[0].title}</p>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{mentor.upcomingSessions[0].date}</span>
              <span>{mentor.upcomingSessions[0].time}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t flex justify-between pt-4">
        <div>
          <p className="text-sm font-medium">${mentor.hourlyRate}/hour</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
          <Link to={`/mentor/${mentor.id}`}>
            <Button size="sm" className="bg-mentor-primary hover:bg-mentor-secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
