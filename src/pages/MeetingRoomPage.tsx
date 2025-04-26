import { MeetingRoom } from "@/components/mentorship/MeetingRoom";

const MeetingRoomPage = () => {
  // The leave button and logic are now inside the MeetingRoom component itself.
  // This component just provides the overall page structure.

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header can remain if needed, or be removed if controls are sufficient */}
      <header className="h-16 bg-black text-white px-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center">
          <div className="font-bold text-xl">Emiwex Session</div>
        </div>
        {/* The Leave button is now part of the MeetingRoom controls */}
        {/* <Button variant="outline" className="text-white border-white/20">
          Leave Meeting
        </Button> */}
      </header>
      {/* MeetingRoom component takes up the remaining space */}
      <MeetingRoom />
    </div>
  );
};

export default MeetingRoomPage;
