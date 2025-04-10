
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorProfile } from "@/components/profile/MentorProfile";
import { getMentorById } from "@/data/mentors";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const MentorProfilePage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const [mentor, setMentor] = useState(mentorId ? getMentorById(mentorId) : null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    if (mentorId) {
      setMentor(getMentorById(mentorId));
    }
  }, [mentorId]);
  
  const handleRequestMentorship = () => {
    setIsRequestDialogOpen(true);
  };
  
  const handleSendRequest = () => {
    toast({
      title: "Mentorship Request Sent!",
      description: `Your request has been sent to ${mentor?.name}. You'll be notified when they respond.`,
    });
    setIsRequestDialogOpen(false);
    setRequestMessage("");
  };

  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Mentor Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The mentor you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <MentorProfile mentor={mentor} onRequestMentorship={handleRequestMentorship} />
        
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Mentorship</DialogTitle>
              <DialogDescription>
                Send a mentorship request to {mentor.name}. Include details about what you'd like to learn and achieve.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="I'm interested in learning more about..."
                  className="min-h-[120px]"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsRequestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSendRequest}>
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default MentorProfilePage;
