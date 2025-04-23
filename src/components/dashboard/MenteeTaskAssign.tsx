import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, FileText, BookOpen, Star } from "lucide-react";

export interface Task {
  id: string;
  type: "assignment" | "assessment";
  title: string;
  description: string;
  due: string;
  status: "pending" | "completed";
}

export function MenteeTaskAssign({ mentee, onClose }: { mentee: string; onClose: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      type: "assignment",
      title: "Build a Portfolio Website",
      description: "Create a personal portfolio website using React.",
      due: "April 30, 2025",
      status: "pending",
    },
    {
      id: "2",
      type: "assessment",
      title: "Quiz: JavaScript Basics",
      description: "Complete the quiz on JavaScript fundamentals.",
      due: "April 25, 2025",
      status: "completed",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "assignment",
    title: "",
    description: "",
    due: "",
  });

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        id: (tasks.length + 1).toString(),
        type: form.type as "assignment" | "assessment",
        title: form.title,
        description: form.description,
        due: form.due,
        status: "pending",
      },
    ]);
    setShowForm(false);
    setForm({ type: "assignment", title: "", description: "", due: "" });
  };

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
          <CardTitle className="text-2xl mb-2">Assign Tasks to {mentee}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button onClick={() => setShowForm(f => !f)} className="mb-4">
              + New Task/Assessment
            </Button>
            {showForm && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex gap-2 mb-2">
                  <Button
                    variant={form.type === "assignment" ? "default" : "outline"}
                    onClick={() => setForm(f => ({ ...f, type: "assignment" }))}
                  >
                    Assignment
                  </Button>
                  <Button
                    variant={form.type === "assessment" ? "default" : "outline"}
                    onClick={() => setForm(f => ({ ...f, type: "assessment" }))}
                  >
                    Assessment
                  </Button>
                </div>
                <Input
                  className="mb-2"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
                <Textarea
                  className="mb-2"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
                <Input
                  className="mb-2"
                  type="date"
                  value={form.due}
                  onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
                />
                <Button
                  className="w-full"
                  onClick={handleAddTask}
                  disabled={!form.title || !form.description || !form.due}
                >
                  Assign
                </Button>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Assigned Tasks & Assessments</h3>
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li key={task.id} className="flex items-start gap-3 bg-gray-100 rounded-lg px-3 py-2">
                    {task.type === "assignment" ? (
                      <BookOpen className="h-5 w-5 text-blue-500 mt-1" />
                    ) : (
                      <Star className="h-5 w-5 text-green-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">{task.description}</div>
                      <div className="text-xs">
                        Due: <span className="font-semibold">{task.due}</span>
                      </div>
                    </div>
                    <Badge
                      className={
                        task.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-green-100 text-green-700 border-green-300"
                      }
                    >
                      {task.status === "pending" ? "Pending" : "Completed"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}