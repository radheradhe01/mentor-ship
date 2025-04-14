
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { interests, categorizedInterests, Interest } from "@/data/interests";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";

interface MenteeInterestsFormProps {
  onSubmit: (data: { name: string, interests: string[] }) => void;
}

export function MenteeInterestsForm({ onSubmit }: MenteeInterestsFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("technology");
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  
  const categories = Object.keys(categorizedInterests);
  
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };
  
  const filteredInterests = searchTerm.trim() === "" 
    ? categorizedInterests[activeCategory] 
    : interests.filter(interest => 
        interest.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, interests: selectedInterests });
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">What are you interested in?</h1>
        <p className="text-muted-foreground">Select your interests to help us match you with the right mentors</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name"
            className="max-w-md"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search interests..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <div className="px-6 pb-2 border-b overflow-x-auto">
          <div className="flex space-x-2 pb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchTerm("");
                }}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  activeCategory === category && searchTerm === ""
                    ? "bg-mentee-primary text-white"
                    : "bg-muted hover:bg-mentee-light/50"
                }`}
              >
                {capitalizeFirstLetter(category)}
              </button>
            ))}
          </div>
        </div>
        
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredInterests.map((interest: Interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`group flex items-center p-3 rounded-lg border transition-all ${
                  selectedInterests.includes(interest.id)
                    ? "border-mentee-primary bg-mentee-soft"
                    : "border-border hover:border-mentee-primary/50 hover:bg-mentee-soft/30"
                }`}
              >
                <div className="flex items-center flex-1">
                  <span className="text-2xl mr-3">{interest.icon}</span>
                  <span className="text-sm font-medium">{interest.name}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedInterests.includes(interest.id)
                    ? "bg-mentee-primary border-mentee-primary text-white"
                    : "border-muted-foreground"
                }`}>
                  {selectedInterests.includes(interest.id) && (
                    <Check className="w-3 h-3" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
        
        <div className="px-6 py-3 border-t">
          <div className="flex flex-wrap gap-2">
            {selectedInterests.length > 0 ? (
              interests
                .filter(i => selectedInterests.includes(i.id))
                .map(interest => (
                  <Badge key={interest.id} variant="secondary" className="py-1">
                    {interest.name}
                    <button 
                      className="ml-1 text-muted-foreground hover:text-foreground" 
                      onClick={() => toggleInterest(interest.id)}
                    >
                      ×
                    </button>
                  </Badge>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No interests selected yet</p>
            )}
          </div>
        </div>
        
        <CardFooter className="flex justify-end border-t pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={selectedInterests.length === 0 || !name.trim()}
            className="bg-mentee-primary hover:bg-mentee-secondary"
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
