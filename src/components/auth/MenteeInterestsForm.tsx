import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Interest {
  id: number;
  name: string;
  icon: string | null;
  category: 'technology' | 'business' | 'creative' | 'academic' | 'personal';
}

type CategorizedInterests = Record<string, Interest[]>;

interface MenteeInterestsFormProps {
  onSubmit: (selectedInterests: number[]) => void;
  isLoading: boolean;
}

export function MenteeInterestsForm({ onSubmit, isLoading }: MenteeInterestsFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<Set<number>>(new Set());
  const [interestsData, setInterestsData] = useState<CategorizedInterests>({});
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [errorInterests, setErrorInterests] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInterests = async () => {
      setLoadingInterests(true);
      setErrorInterests(null);
      try {
        const response = await fetch("/interests/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Interest[] = await response.json();

        const categorized = data.reduce((acc, interest) => {
          const categoryKey = interest.category || 'other';
          if (!acc[categoryKey]) {
            acc[categoryKey] = [];
          }
          acc[categoryKey].push(interest);
          return acc;
        }, {} as CategorizedInterests);

        setInterestsData(categorized);
      } catch (error: any) {
        console.error("Failed to fetch interests:", error);
        setErrorInterests("Failed to load interests. Please try again later.");
        toast({
          title: "Error",
          description: "Could not load interests.",
          variant: "destructive",
        });
      } finally {
        setLoadingInterests(false);
      }
    };

    fetchInterests();
  }, [toast]);

  const handleCheckboxChange = (interestId: number) => {
    setSelectedInterests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.size < 3) {
      toast({
        title: "Select Interests",
        description: "Please select at least 3 interests.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(Array.from(selectedInterests));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Select Your Interests</CardTitle>
        <CardDescription>Choose at least 3 areas you're interested in learning about.</CardDescription>
      </CardHeader>
      <CardContent>
        {loadingInterests ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2">Loading Interests...</span>
          </div>
        ) : errorInterests ? (
          <div className="text-center text-red-500">{errorInterests}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(interestsData).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-medium capitalize mb-3 border-b pb-1">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest.id}`}
                        checked={selectedInterests.has(interest.id)}
                        onCheckedChange={() => handleCheckboxChange(interest.id)}
                      />
                      <Label htmlFor={`interest-${interest.id}`} className="flex items-center gap-2 cursor-pointer">
                        {interest.icon && <span className="text-xl">{interest.icon}</span>}
                        {interest.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading || selectedInterests.size < 3}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Saving..." : "Save Interests"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
