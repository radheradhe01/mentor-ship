
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-mentor-primary/20 to-mentee-primary/20" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your perfect mentor match?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join MentorSpark today and take the first step toward achieving your goals with personalized guidance from experts in your field.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-mentor-primary hover:bg-mentor-secondary">
                Sign Up as Mentor
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-mentee-primary hover:bg-mentee-secondary">
                Sign Up as Mentee
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
