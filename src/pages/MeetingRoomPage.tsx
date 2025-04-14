
import { MeetingRoom } from "@/components/mentorship/MeetingRoom";
import { Button } from "@/components/ui/button";

const MeetingRoomPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <header className="h-16 bg-black text-white px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center">
          <div className="font-bold text-xl">MentorSpark</div>
        </div>
        <Button variant="outline" className="text-white border-white/20">
          Leave Meeting
        </Button>
      </header>
      <MeetingRoom />
    </div>
  );
};

export default MeetingRoomPage;
