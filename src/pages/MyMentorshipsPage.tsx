
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorCard } from "@/components/explore/MentorCard";
import { MentorFilters } from "@/components/explore/MentorFilters";
import { mentors, getMentorsByInterests } from "@/data/mentors";
import { useUser } from "@/context/UserContext";

const MyMentorshipsPage = () => {
  const { user } = useUser();
  const [filteredMentors, setFilteredMentors] = useState(mentors);
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
  
  // Apply filters whenever they change
  useEffect(() => {
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
  }, [filters]);
  
  const handleFilterChange = (newFilters: {
    search: string;
    interests: string[];
    priceRange: [number, number];
    rating: number;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Mentorships</h1>
          <p className="text-muted-foreground">
            Browse your current mentorships and mentor relationships.
          </p>
        </div>
        
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
                <h3 className="text-lg font-medium mb-2">No mentorships found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms to find your mentors.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyMentorshipsPage;
