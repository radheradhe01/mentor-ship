
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, CheckCircle } from "lucide-react";
import { useReadContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { abi } from "../../abi/mentorshipAbi.ts";

interface MentorQualificationFormProps {
  onSubmit: (qualifications: any) => void;
}

export function MentorQualificationForm({ onSubmit }: MentorQualificationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    highSchool: "",
    graduation: "",
    achievements: [""],
    experience: "",
    mentorshipExperience: "",
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = 3;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData(prev => ({ ...prev, achievements: newAchievements }));
  };
  
  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, ""]
    }));
  };
  
  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, achievements: newAchievements }));
  };
  
  const nextStep = () => {
    setActiveStep(prev => Math.min(prev + 1, totalSteps - 1));
  };
  
  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty achievements
    const filteredAchievements = formData.achievements.filter(a => a.trim() !== "");
    const qualifications = {
      ...formData,
      achievements: filteredAchievements,
    };
    onSubmit(qualifications);
  };

  const { writeContract, isPending, error } = useWriteContract();

  async function ragistorMentor(_name , _mentorPrice) {
    alert("hello")
    try {
      await writeContract({
        address: '0x93eC3AadBF6E65a93c48836Bd78da2860942620f',
        abi: abi,
        functionName: "ragistorMentor",
        args: ["hello" , ethers.toBigInt(1)],
      })
    } catch(err) {
      console.log("error from ragistor mentor: " , err);
    }
  }
  
  const steps = [
    {
      title: "Basic Information",
      description: "Let's start with some basic information about you",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="highSchool">High School</Label>
            <Input
              id="highSchool"
              name="highSchool"
              value={formData.highSchool}
              onChange={handleInputChange}
              placeholder="Your high school name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduation">Graduation</Label>
            <Input
              id="graduation"
              name="graduation"
              value={formData.graduation}
              onChange={handleInputChange}
              placeholder="Degree, University"
              required
            />
          </div>
        </div>
      ),
    },
    {
      title: "Achievements",
      description: "Share your notable achievements and certifications",
      content: (
        <div className="space-y-4">
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={achievement}
                onChange={(e) => handleAchievementChange(index, e.target.value)}
                placeholder="e.g., Award, Certification, Publication"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAchievement(index)}
                disabled={formData.achievements.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addAchievement}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>
      ),
    },
    {
      title: "Experience",
      description: "Tell us about your professional and mentorship experience",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="experience">Industry Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Describe your professional experience, roles, and companies you've worked for"
              className="min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mentorshipExperience">Mentorship Experience (if any)</Label>
            <Textarea
              id="mentorshipExperience"
              name="mentorshipExperience"
              value={formData.mentorshipExperience}
              onChange={handleInputChange}
              placeholder="Describe any previous mentorship experience you have"
              className="min-h-[100px]"
            />
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <div className="mx-auto max-w-md space-y-6 py-10 animate-fade-in">
      <div className="flex mb-8 justify-center">
        {Array(totalSteps)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index < activeStep
                    ? "border-mentor-primary bg-mentor-primary text-white"
                    : index === activeStep
                    ? "border-mentor-primary bg-mentor-soft text-mentor-primary"
                    : "border-muted bg-muted/30"
                }`}
              >
                {index < activeStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 w-10 ${
                    index < activeStep ? "bg-mentor-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{steps[activeStep].title}</CardTitle>
          <CardDescription>{steps[activeStep].description}</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => {handleSubmit(e); ragistorMentor("mentor name" , 10)}}>
          <CardContent>{steps[activeStep].content}</CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={activeStep === 0}
            >
              Previous
            </Button>
            {activeStep === totalSteps - 1 ? (
              <Button type="submit" className="bg-mentor-primary hover:bg-mentor-secondary">
                Complete Profile
              </Button>
            ) : (
              <Button type="button" onClick={nextStep} className="bg-mentor-primary hover:bg-mentor-secondary">
                Next
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
