import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, CheckCircle } from "lucide-react";
import { useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { abi } from "../../abi/mentorshipAbi.ts";
import { useToast } from "@/components/ui/use-toast";

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
    mentorPrice: "0.01",
  });

  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = 4;
  const { toast } = useToast();

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

  const { writeContract, isPending, error: writeContractError } = useWriteContract();

  async function registerMentorOnChain(name: string, price: string) {
    try {
      const priceInWei = ethers.parseEther(price);
      await writeContract({
        address: '0x93eC3AadBF6E65a93c48836Bd78da2860942620f',
        abi: abi,
        functionName: "ragistorMentor",
        args: [name, priceInWei],
      });
      toast({ title: "Blockchain Transaction Sent", description: "Mentor registration submitted to the blockchain." });
      return true;
    } catch (err: any) {
      console.error("Error registering mentor on chain: ", err);
      const message = err.shortMessage || err.message || "An unknown error occurred.";
      toast({ title: "Blockchain Error", description: `Failed to register mentor on-chain: ${message}`, variant: "destructive" });
      return false;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registrationSuccess = await registerMentorOnChain(formData.name, formData.mentorPrice);

    if (!registrationSuccess) {
      return;
    }

    const filteredAchievements = formData.achievements.filter(a => a.trim() !== "");
    const qualifications = {
      ...formData,
      achievements: filteredAchievements,
    };
    onSubmit(qualifications);
  };

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
    {
      title: "Mentorship Price",
      description: "Set your price per mentorship session (in ETH)",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mentorPrice">Price (ETH)</Label>
            <Input
              id="mentorPrice"
              name="mentorPrice"
              type="number"
              step="0.001"
              min="0"
              value={formData.mentorPrice}
              onChange={handleInputChange}
              placeholder="e.g., 0.05"
              required
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
        <CardContent>{steps[activeStep].content}</CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={activeStep === 0 || isPending}
          >
            Previous
          </Button>
          {activeStep === totalSteps - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-mentor-primary hover:bg-mentor-secondary"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Complete Profile"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-mentor-primary hover:bg-mentor-secondary"
              disabled={isPending}
            >
              Next
            </Button>
          )}
        </CardFooter>
        {writeContractError && (
          <p className="text-xs text-red-500 px-6 pb-4">Error: {writeContractError.shortMessage || writeContractError.message}</p>
        )}
      </Card>
    </div>
  );
}
