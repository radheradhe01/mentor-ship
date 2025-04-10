
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Video, MessageSquare, Search, Award } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Users className="h-12 w-12 text-mentor-primary" />,
      title: "Find the Perfect Mentor",
      description: "Browse through our curated list of expert mentors in your field of interest."
    },
    {
      icon: <Video className="h-12 w-12 text-mentee-primary" />,
      title: "Live Mentoring Sessions",
      description: "Attend live sessions to get a feel for a mentor's teaching style before connecting."
    },
    {
      icon: <Calendar className="h-12 w-12 text-mentor-primary" />,
      title: "Structured Mentorship",
      description: "Clearly defined mentorship periods with goals and expectations for both parties."
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-mentee-primary" />,
      title: "Real-time Communication",
      description: "Connect via video calls and messaging within our integrated platform."
    },
    {
      icon: <Search className="h-12 w-12 text-mentor-primary" />,
      title: "Interest-Based Matching",
      description: "Our algorithm recommends mentors based on your specific interests and goals."
    },
    {
      icon: <Award className="h-12 w-12 text-mentee-primary" />,
      title: "Verified Qualifications",
      description: "All mentors undergo a verification process to ensure quality guidance."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">How MentorSpark Works</h2>
          <p className="text-muted-foreground text-lg">
            Our platform makes it easy to connect with the right mentor and build meaningful relationships that accelerate your growth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-scale">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
