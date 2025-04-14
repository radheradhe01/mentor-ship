import React from 'react';
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorCard } from "@/components/explore/MentorCard";
import { MentorFilters } from "@/components/explore/MentorFilters";
import { JobOpportunityList } from "@/components/explore/JobOpportunityList";
import { mentors, getMentorsByInterests } from "@/data/mentors";
import { useUser } from "@/context/UserContext";
import { Search, BookUser, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [filteredMentors, setFilteredMentors] = useState(mentors);
  const [activeTab, setActiveTab] = useState("mentors");
  const [filters, setFilters] = useState({
    search: "",
    interests: [] as string[],
    priceRange: [0, 200] as [number, number],
    rating: 0,
  });
  
  // Initialize filters with user interests if they are a mentee
  useEffect(() => {
    if (user?.userType === 'mentee' && user?.interests?.length) {
      setFilters(prev => ({
        ...prev,
        interests: user.interests || []
      }));
    }
  }, [user]);
  
  // Apply filters whenever they change (only for mentors view)
  useEffect(() => {
    // Only apply mentor filters if the mentors tab is active
    if (activeTab !== 'mentors') {
      setFilteredMentors(mentors); // Reset or handle differently if needed
      return;
    }

    let result = mentors;
    
    // Filter by interests
    if (filters.interests.length > 0) {
      result = getMentorsByInterests(filters.interests);
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        mentor => 
          mentor.name.toLowerCase().includes(searchTerm) || 
          mentor.title.toLowerCase().includes(searchTerm) ||
          mentor.about.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by price range
    result = result.filter(
      mentor => 
        mentor.hourlyRate >= filters.priceRange[0] && 
        mentor.hourlyRate <= filters.priceRange[1]
    );
    
    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter(mentor => mentor.rating >= filters.rating);
    }
    
    setFilteredMentors(result);
  }, [filters, activeTab]);
  
  const handleFilterChange = (newFilters: {
    search: string;
    interests: string[];
    priceRange: [number, number];
    rating: number;
  }) => {
    setFilters(newFilters);
  };

  // Function to determine page title based on active tab
  const getPageTitle = () => {
    return activeTab === "mentors" ? "Find Your Perfect Mentor" : "Explore Job Opportunities";
  }

  const getPageDescription = () => {
     return activeTab === "mentors" 
      ? "Browse our community of expert mentors ready to help you achieve your goals."
      : "Discover recent job openings relevant to your interests.";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
            <p className="text-muted-foreground">
              {getPageDescription()}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-mentee-primary hover:bg-mentee-secondary"
              onClick={() => navigate('/mentee/mentorships')}
            >
              <BookUser className="h-4 w-4 mr-2" />
              View My Mentorships
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="mentors">
              <Users className="h-4 w-4 mr-2" /> Mentors
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" /> Job Opportunities
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {activeTab === "mentors" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <MentorFilters onFilterChange={handleFilterChange} />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {filteredMentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No mentors found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms to find more mentors.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <JobOpportunityList /> 
        )}
        
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;
