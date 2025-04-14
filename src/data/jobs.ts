export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedDate: Date;
  deadlineDate: Date;
  url: string;
}

export const jobOpportunities: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'Software Engineer Intern',
    company: 'Innovate Solutions',
    description: 'Assist senior engineers in developing and testing new software features. Opportunity to learn React and Node.js.',
    location: 'Remote',
    employmentType: 'Internship',
    postedDate: new Date('2024-07-15'),
    deadlineDate: new Date('2024-08-15'),
    url: '#',
  },
  {
    id: 'job-2',
    title: 'Frontend Developer',
    company: 'TechGenius',
    description: 'Build responsive and user-friendly web interfaces using modern frontend frameworks. Collaborate with UI/UX designers.',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    postedDate: new Date('2024-07-10'),
    deadlineDate: new Date('2024-08-10'),
    url: '#',
  },
  {
    id: 'job-3',
    title: 'Data Scientist',
    company: 'Data Insights Inc.',
    description: 'Analyze large datasets to extract meaningful insights and build predictive models. Experience with Python and SQL required.',
    location: 'New York, NY',
    employmentType: 'Full-time',
    postedDate: new Date('2024-07-20'),
    deadlineDate: new Date('2024-09-01'),
    url: '#',
  },
  {
    id: 'job-4',
    title: 'UX Designer (Part-time)',
    company: 'Creative Minds',
    description: 'Design intuitive user experiences for mobile and web applications. Create wireframes, mockups, and prototypes.',
    location: 'Remote',
    employmentType: 'Part-time',
    postedDate: new Date('2024-07-18'),
    deadlineDate: new Date('2024-08-20'),
    url: '#',
  },
    {
    id: 'job-5',
    title: 'Backend Engineer (Contract)',
    company: 'ScaleFast Systems',
    description: 'Develop and maintain scalable backend services using Go and microservices architecture. 6-month contract position.',
    location: 'Austin, TX',
    employmentType: 'Contract',
    postedDate: new Date('2024-07-05'),
    deadlineDate: new Date('2024-07-31'),
    url: '#',
  },
]; 