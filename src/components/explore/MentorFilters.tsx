import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

interface Interest {
  id: number;
  name: string;
  icon: string | null;
  category: string;
}

type CategorizedInterests = Record<string, Interest[]>;

interface MentorFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function MentorFilters({ onFilterChange }: MentorFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<number>>(new Set());
  const [hourlyRateRange, setHourlyRateRange] = useState<[number, number]>([0, 200]);
  const [availability, setAvailability] = useState<Set<string>>(new Set());

  const [interestsData, setInterestsData] = useState<CategorizedInterests>({});
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [errorInterests, setErrorInterests] = useState<string | null>(null);

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
        console.error("Failed to fetch interests for filters:", error);
        setErrorInterests("Failed to load filter options.");
      } finally {
        setLoadingInterests(false);
      }
    };

    fetchInterests();
  }, []);

  const handleInterestChange = (interestId: number) => {
    setSelectedInterests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      applyFilters(searchTerm, newSet, hourlyRateRange, availability);
      return newSet;
    });
  };

  const handleAvailabilityChange = (day: string) => {
    setAvailability(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      applyFilters(searchTerm, selectedInterests, hourlyRateRange, newSet);
      return newSet;
    });
  };

  const handleRateChange = (value: [number, number]) => {
    setHourlyRateRange(value);
    applyFilters(searchTerm, selectedInterests, value, availability);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    applyFilters(newSearchTerm, selectedInterests, hourlyRateRange, availability);
  };

  const applyFilters = (
    currentSearchTerm: string,
    currentInterests: Set<number>,
    currentRateRange: [number, number],
    currentAvailability: Set<string>
  ) => {
    onFilterChange({
      searchTerm: currentSearchTerm,
      interests: Array.from(currentInterests),
      minRate: currentRateRange[0],
      maxRate: currentRateRange[1],
      availability: Array.from(currentAvailability),
    });
  };

  const availabilityOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="w-full md:w-72 lg:w-80 space-y-6 sticky top-20 self-start">
      <h2 className="text-xl font-semibold">Filters</h2>

      <div>
        <Label htmlFor="search-mentor">Search by name or title</Label>
        <Input
          id="search-mentor"
          placeholder="e.g., 'Software Engineer'"
          value={searchTerm}
          onChange={handleSearchChange}
          className="mt-1"
        />
      </div>

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Interests</AccordionTrigger>
          <AccordionContent>
            {loadingInterests ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : errorInterests ? (
              <div className="text-red-500 text-sm p-2">{errorInterests}</div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {Object.entries(interestsData).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium capitalize mb-2">{category}</h4>
                    <div className="space-y-2">
                      {items.map((interest) => (
                        <div key={interest.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-interest-${interest.id}`}
                            checked={selectedInterests.has(interest.id)}
                            onCheckedChange={() => handleInterestChange(interest.id)}
                          />
                          <Label htmlFor={`filter-interest-${interest.id}`} className="text-sm font-normal cursor-pointer">
                            {interest.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Hourly Rate</AccordionTrigger>
          <AccordionContent className="pt-4">
            <Slider
              min={0}
              max={200}
              step={5}
              value={hourlyRateRange}
              onValueChange={handleRateChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${hourlyRateRange[0]}</span>
              <span>${hourlyRateRange[1] === 200 ? '200+' : hourlyRateRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availabilityOptions.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-avail-${day}`}
                    checked={availability.has(day)}
                    onCheckedChange={() => handleAvailabilityChange(day)}
                  />
                  <Label htmlFor={`filter-avail-${day}`} className="text-sm font-normal cursor-pointer">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
