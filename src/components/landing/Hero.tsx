
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-mentor-soft to-mentee-soft opacity-70" />
      
      <div className="container relative pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-fade-in">
              Connect with the <span className="text-mentor-primary">mentor</span> who
              <br className="hidden sm:inline" /> will change your <span className="text-mentee-primary">journey</span>
            </h1>
            
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              MentorSpark connects mentors and mentees for meaningful growth.
              Learn from industry experts through personalized guidance and live sessions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-mentor-primary hover:bg-mentor-secondary">
                  Get Started
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Mentors
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex -space-x-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-medium">500+ mentors</p>
                <p className="text-muted-foreground">Joined this month</p>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-mentor-primary to-mentee-primary rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-white dark:bg-black p-4 rounded-3xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                alt="Mentors collaborating" 
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            </div>
            
            <div className="absolute top-10 -left-16 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mentor-light/50 flex items-center justify-center text-mentor-primary">
                  🎯
                </div>
                <div>
                  <p className="font-medium">Personalized Guidance</p>
                  <p className="text-sm text-muted-foreground">Tailored to your needs</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-10 -right-16 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mentee-light/50 flex items-center justify-center text-mentee-primary">
                  💡
                </div>
                <div>
                  <p className="font-medium">Live Expert Sessions</p>
                  <p className="text-sm text-muted-foreground">Learn in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
