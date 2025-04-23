import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, BarChart2, BookOpen, Star } from "lucide-react";

const dummyStats = {
  assignmentsCompleted: 4,
  assignmentsTotal: 6,
  assessmentsCompleted: 2,
  assessmentsTotal: 3,
  averageScore: 87,
  lastScore: 92,
  feedback: "Great progress! Keep up the consistency.",
  recent: [
    {
      type: "assignment",
      title: "Portfolio Website",
      status: "completed",
      score: null,
    },
    {
      type: "assessment",
      title: "Quiz: JavaScript Basics",
      status: "completed",
      score: 92,
    },
    {
      type: "assignment",
      title: "Case Study: Spotify",
      status: "pending",
      score: null,
    },
  ],
};

export function MenteeReportCard({ mentee, onClose }: { mentee: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <CardHeader>
          <CardTitle className="text-2xl mb-2">{mentee}'s Report Card & Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Performance Overview</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                Assignments:{" "}
                <span className="font-semibold">
                  {dummyStats.assignmentsCompleted}/{dummyStats.assignmentsTotal}
                </span>
              </div>
              <div>
                Assessments:{" "}
                <span className="font-semibold">
                  {dummyStats.assessmentsCompleted}/{dummyStats.assessmentsTotal}
                </span>
              </div>
              <div>
                Avg. Score: <span className="font-semibold">{dummyStats.averageScore}%</span>
              </div>
              <div>
                Last Score: <span className="font-semibold">{dummyStats.lastScore}%</span>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Mentor Feedback:</span>{" "}
              <span className="italic">{dummyStats.feedback}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Recent Tasks & Assessments</h3>
            <ul className="space-y-3">
              {dummyStats.recent.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                  {item.type === "assignment" ? (
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Star className="h-5 w-5 text-green-500" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    {item.score !== null && (
                      <div className="text-xs text-muted-foreground">Score: {item.score}%</div>
                    )}
                  </div>
                  <Badge
                    className={
                      item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : "bg-green-100 text-green-700 border-green-300"
                    }
                  >
                    {item.status === "pending" ? "Pending" : "Completed"}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </div>
    </div>
  );
}