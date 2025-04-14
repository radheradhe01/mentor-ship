
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      quote: "Finding a mentor who truly understands my career goals has been transformative. My mentor helped me navigate a career transition from marketing to UX design.",
      author: "Sarah Johnson",
      role: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      background: "bg-mentee-soft"
    },
    {
      quote: "As a mentor, I've found tremendous fulfillment in guiding junior developers. MentorSpark has connected me with passionate mentees who are eager to learn.",
      author: "Michael Chen",
      role: "Senior Software Engineer",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      background: "bg-mentor-soft"
    },
    {
      quote: "The live sessions feature is incredible. I was able to attend several sessions before choosing my current mentor, which ensured we were a good fit.",
      author: "Alex Rivera",
      role: "Product Manager",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      background: "bg-mentee-soft"
    }
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of mentors and mentees who are building meaningful connections on MentorSpark.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={`hover-scale border-0 ${testimonial.background}`}>
              <CardContent className="pt-6">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <blockquote className="text-lg italic mb-6">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
              <CardFooter className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
