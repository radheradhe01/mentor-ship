
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { interests, categorizedInterests } from "@/data/interests";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, ChevronUp, Search, SlidersHorizontal, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MentorFiltersProps {
  onFilterChange: (filters: {
    search: string;
    interests: string[];
    priceRange: [number, number];
    rating: number;
  }) => void;
}

export function MentorFilters({ onFilterChange }: MentorFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    interests: [] as string[],
    priceRange: [0, 200] as [number, number],
    rating: 0,
  });
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
    onFilterChange({ ...filters, search: e.target.value });
  };
  
  const toggleInterest = (interestId: string) => {
    const newInterests = filters.interests.includes(interestId)
      ? filters.interests.filter(id => id !== interestId)
      : [...filters.interests, interestId];
    
    setFilters({ ...filters, interests: newInterests });
    onFilterChange({ ...filters, interests: newInterests });
  };
  
  const handlePriceChange = (value: number[]) => {
    const priceRange = [value[0], value[1]] as [number, number];
    setFilters({ ...filters, priceRange });
    onFilterChange({ ...filters, priceRange });
  };
  
  const handleRatingChange = (value: number[]) => {
    setFilters({ ...filters, rating: value[0] });
    onFilterChange({ ...filters, rating: value[0] });
  };
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(
      expandedCategories.includes(category)
        ? expandedCategories.filter(c => c !== category)
        : [...expandedCategories, category]
    );
  };
  
  const clearFilters = () => {
    setFilters({
      search: "",
      interests: [],
      priceRange: [0, 200],
      rating: 0,
    });
    onFilterChange({
      search: "",
      interests: [],
      priceRange: [0, 200],
      rating: 0,
    });
  };
  
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mentors..."
            className="pl-10"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      {filters.interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.interests.map(interestId => {
            const interest = interests.find(i => i.id === interestId);
            if (!interest) return null;
            return (
              <Badge key={interestId} variant="secondary" className="py-1">
                {interest.name}
                <button 
                  className="ml-1 text-muted-foreground hover:text-foreground" 
                  onClick={() => toggleInterest(interestId)}
                >
                  ×
                </button>
              </Badge>
            );
          })}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
      
      <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block`}>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Hourly Rate</h3>
            <div className="space-y-4">
              <Slider
                defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                max={200}
                step={5}
                onValueChange={handlePriceChange}
                className="my-4"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">${filters.priceRange[0]}</p>
                <p className="text-sm text-muted-foreground">${filters.priceRange[1]}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Minimum Rating</h3>
            <div className="space-y-4">
              <Slider
                defaultValue={[filters.rating]}
                max={5}
                step={0.5}
                onValueChange={handleRatingChange}
                className="my-4"
              />
              <div className="flex items-center">
                <p className="text-sm text-muted-foreground">
                  {filters.rating > 0 ? `${filters.rating}+ stars` : "Any rating"}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Interests</h3>
            <div className="space-y-2">
              {Object.keys(categorizedInterests).map(category => (
                <Collapsible
                  key={category}
                  open={expandedCategories.includes(category)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => toggleCategory(category)}
                    >
                      <span className="capitalize">{category}</span>
                      {expandedCategories.includes(category) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-1">
                    {categorizedInterests[category].map(interest => (
                      <div
                        key={interest.id}
                        className="flex items-center py-1"
                      >
                        <button
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                            filters.interests.includes(interest.id)
                              ? "bg-mentee-primary border-mentee-primary text-white"
                              : "border-muted-foreground"
                          }`}
                          onClick={() => toggleInterest(interest.id)}
                        >
                          {filters.interests.includes(interest.id) && (
                            <Check className="w-3 h-3" />
                          )}
                        </button>
                        <Label
                          htmlFor={`interest-${interest.id}`}
                          className="cursor-pointer text-sm flex-1"
                          onClick={() => toggleInterest(interest.id)}
                        >
                          {interest.name}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
