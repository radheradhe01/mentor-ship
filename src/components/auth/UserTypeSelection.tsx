
import { useState } from "react";
import { ArrowRight, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface UserTypeSelectionProps {
  onSelect: (type: 'mentor' | 'mentee') => void;
}

export function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<'mentor' | 'mentee' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Join MentorSpark</h1>
        <p className="text-muted-foreground">Select your role to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card 
          className={`border-2 hover-scale cursor-pointer ${
            selectedType === 'mentor' 
              ? 'border-mentor-primary bg-mentor-soft/30' 
              : 'hover:border-mentor-primary/50'
          }`}
          onClick={() => setSelectedType('mentor')}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Mentor</CardTitle>
              <div className={`p-2 rounded-full ${selectedType === 'mentor' ? 'bg-mentor-primary text-white' : 'bg-muted'}`}>
                <User size={24} />
              </div>
            </div>
            <CardDescription>Share your expertise and guide others</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-mentor-primary">✓</span>
                <span>Create live mentoring sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mentor-primary">✓</span>
                <span>Connect with motivated mentees</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mentor-primary">✓</span>
                <span>Showcase your expertise</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mentor-primary">✓</span>
                <span>Build your mentorship portfolio</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card 
          className={`border-2 hover-scale cursor-pointer ${
            selectedType === 'mentee' 
              ? 'border-mentee-primary bg-mentee-soft/30' 
              : 'hover:border-mentee-primary/50'
          }`}
          onClick={() => setSelectedType('mentee')}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Mentee</CardTitle>
              <div className={`p-2 rounded-full ${selectedType === 'mentee' ? 'bg-mentee-primary text-white' : 'bg-muted'}`}>
                <Users size={24} />
              </div>
            </div>
            <CardDescription>Find mentors to accelerate your growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-mentee-primary">✓</span>
                <span>Access to expert mentors</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mentee-primary">✓</span>
                <span>Personalized guidance in your field</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mentee-primary">✓</span>
                <span>Watch live mentoring sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mentee-primary">✓</span>
                <span>Connect with like-minded peers</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          className="w-full sm:w-auto"
          disabled={!selectedType}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
