
import { interests } from './interests';

export interface Mentor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  interests: string[];
  qualifications: {
    highSchool: string;
    graduation: string;
    achievements: string[];
    experience: string;
    mentorshipExperience: string;
  };
  about: string;
  availability: {
    days: string[];
    hours: string;
  };
  upcomingSessions: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number; // minutes
  }[];
}

// Function to get random interests
const getRandomInterests = (count: number) => {
  const shuffled = [...interests].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(interest => interest.id);
};

export const mentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    title: "Senior Software Engineer at Google",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    reviewCount: 124,
    hourlyRate: 85,
    interests: getRandomInterests(3),
    qualifications: {
      highSchool: "Phillips Exeter Academy",
      graduation: "Ph.D. in Computer Science, Stanford University",
      achievements: [
        "Google Developer Expert",
        "Author of 'Modern Web Development'",
        "3x Hackathon Winner"
      ],
      experience: "12 years in software development, specializing in web technologies and distributed systems.",
      mentorshipExperience: "Mentored 30+ junior developers over 5 years, with a focus on career transitions."
    },
    about: "I'm passionate about helping people break into tech. With over a decade of experience at companies like Google and Microsoft, I can help you navigate the complex world of software engineering, from technical skills to career strategy.",
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "6:00 PM - 9:00 PM EST"
    },
    upcomingSessions: [
      {
        id: "s1",
        title: "System Design Interview Preparation",
        description: "Learn how to approach and solve system design interview questions.",
        date: "2025-04-15",
        time: "7:00 PM EST",
        duration: 60
      }
    ]
  },
  {
    id: "2",
    name: "Michael Johnson",
    title: "Product Manager at Spotify",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.7,
    reviewCount: 98,
    hourlyRate: 75,
    interests: getRandomInterests(4),
    qualifications: {
      highSchool: "Stuyvesant High School",
      graduation: "MBA, Harvard Business School",
      achievements: [
        "Product Hunt Maker of the Year Finalist",
        "Speaker at ProductCon 2024",
        "Forbes 30 Under 30"
      ],
      experience: "8 years in product management at companies like Spotify and Dropbox.",
      mentorshipExperience: "4 years mentoring product managers and founders."
    },
    about: "I help aspiring and junior product managers build successful product careers. My approach combines practical frameworks with real-world examples from my experience at top tech companies.",
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      hours: "5:00 PM - 8:00 PM PST"
    },
    upcomingSessions: [
      {
        id: "s2",
        title: "Building Your First Product Roadmap",
        description: "Step-by-step guide to creating effective product roadmaps that align with business goals.",
        date: "2025-04-20",
        time: "6:00 PM PST",
        duration: 90
      }
    ]
  },
  {
    id: "3",
    name: "Aisha Patel",
    title: "Data Scientist at Netflix",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    rating: 4.8,
    reviewCount: 112,
    hourlyRate: 90,
    interests: getRandomInterests(3),
    qualifications: {
      highSchool: "Bronx High School of Science",
      graduation: "M.S. in Data Science, UC Berkeley",
      achievements: [
        "Kaggle Competition Winner",
        "Published in Journal of Machine Learning Research",
        "Netflix Data Science Excellence Award"
      ],
      experience: "6 years in data science, specializing in recommendation systems and A/B testing.",
      mentorshipExperience: "Led the data science mentorship program at Netflix for 2 years."
    },
    about: "I specialize in helping people transition into data science from various backgrounds. Whether you're a software engineer, analyst, or complete beginner, I can guide you through the technical skills and project portfolio needed to land your dream job.",
    availability: {
      days: ["Monday", "Wednesday", "Sunday"],
      hours: "7:00 PM - 10:00 PM EST"
    },
    upcomingSessions: [
      {
        id: "s3",
        title: "Data Science Portfolio Workshop",
        description: "How to build a data science portfolio that stands out to recruiters.",
        date: "2025-04-18",
        time: "8:00 PM EST",
        duration: 120
      }
    ]
  },
  {
    id: "4",
    name: "James Wilson",
    title: "Startup Founder & Angel Investor",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 4.6,
    reviewCount: 87,
    hourlyRate: 120,
    interests: getRandomInterests(4),
    qualifications: {
      highSchool: "Thomas Jefferson High School for Science and Technology",
      graduation: "B.S. in Computer Science, MIT",
      achievements: [
        "Founded 2 successful startups (1 acquired)",
        "Raised $5M in venture funding",
        "Angel investor in 12 startups"
      ],
      experience: "10 years as a founder, 5 years as an investor.",
      mentorshipExperience: "Mentored 15+ founders, helping them raise collectively over $10M."
    },
    about: "I help first-time founders navigate the startup journey, from idea validation to fundraising. Having built and sold my own startups, I provide practical, no-nonsense advice on what actually works in the real world.",
    availability: {
      days: ["Tuesday", "Thursday", "Friday"],
      hours: "11:00 AM - 2:00 PM PST"
    },
    upcomingSessions: [
      {
        id: "s4",
        title: "Fundraising Strategies for Early-Stage Startups",
        description: "Learn how to approach investors and craft a compelling pitch.",
        date: "2025-04-25",
        time: "12:00 PM PST",
        duration: 90
      }
    ]
  },
  {
    id: "5",
    name: "Sofia Rodriguez",
    title: "UX/UI Designer at Airbnb",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    rating: 4.9,
    reviewCount: 135,
    hourlyRate: 95,
    interests: getRandomInterests(3),
    qualifications: {
      highSchool: "Los Angeles County High School for the Arts",
      graduation: "BFA in Graphic Design, Rhode Island School of Design",
      achievements: [
        "AWWWARDS Site of the Day Winner",
        "Featured in Communication Arts",
        "Speaker at Interaction Design Conference"
      ],
      experience: "9 years in UX/UI design at companies like Airbnb, Pinterest, and Square.",
      mentorshipExperience: "Mentored 25+ designers through ADPList and independently."
    },
    about: "I help designers level up their skills and build compelling portfolios. My focus is on user-centered design processes and storytelling through your work to land opportunities at top companies.",
    availability: {
      days: ["Monday", "Wednesday", "Saturday"],
      hours: "4:00 PM - 8:00 PM PST"
    },
    upcomingSessions: [
      {
        id: "s5",
        title: "Design Portfolio Review Workshop",
        description: "Get feedback on your design portfolio and learn how to showcase your work effectively.",
        date: "2025-04-22",
        time: "5:00 PM PST",
        duration: 180
      }
    ]
  }
];

// Helper function to get mentors based on interest IDs
export const getMentorsByInterests = (interestIds: string[]) => {
  if (!interestIds.length) return mentors;
  
  return mentors.filter(mentor => 
    mentor.interests.some(interest => interestIds.includes(interest))
  );
};

// Function to get a mentor by ID
export const getMentorById = (id: string) => {
  return mentors.find(mentor => mentor.id === id);
};
