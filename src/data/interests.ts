
export interface Interest {
  id: string;
  name: string;
  icon: string;
  category: 'technology' | 'business' | 'creative' | 'academic' | 'personal';
}

export const interests: Interest[] = [
  { id: '1', name: 'Web Development', icon: '💻', category: 'technology' },
  { id: '2', name: 'Mobile Development', icon: '📱', category: 'technology' },
  { id: '3', name: 'Data Science', icon: '📊', category: 'technology' },
  { id: '4', name: 'Machine Learning', icon: '🤖', category: 'technology' },
  { id: '5', name: 'DevOps', icon: '🔄', category: 'technology' },
  { id: '6', name: 'UI/UX Design', icon: '🎨', category: 'creative' },
  { id: '7', name: 'Product Management', icon: '📋', category: 'business' },
  { id: '8', name: 'Entrepreneurship', icon: '🚀', category: 'business' },
  { id: '9', name: 'Digital Marketing', icon: '📢', category: 'business' },
  { id: '10', name: 'Finance', icon: '💰', category: 'business' },
  { id: '11', name: 'Career Development', icon: '📈', category: 'personal' },
  { id: '12', name: 'Leadership', icon: '👑', category: 'personal' },
  { id: '13', name: 'Communication Skills', icon: '🗣️', category: 'personal' },
  { id: '14', name: 'Public Speaking', icon: '🎤', category: 'personal' },
  { id: '15', name: 'Academic Research', icon: '🔍', category: 'academic' },
  { id: '16', name: 'Mathematics', icon: '🧮', category: 'academic' },
  { id: '17', name: 'Physics', icon: '⚛️', category: 'academic' },
  { id: '18', name: 'Literature', icon: '📚', category: 'academic' },
  { id: '19', name: 'Psychology', icon: '🧠', category: 'academic' },
  { id: '20', name: 'Foreign Languages', icon: '🌎', category: 'academic' },
  { id: '21', name: 'Photography', icon: '📷', category: 'creative' },
  { id: '22', name: 'Video Production', icon: '🎥', category: 'creative' },
  { id: '23', name: 'Music', icon: '🎵', category: 'creative' },
  { id: '24', name: 'Writing', icon: '✍️', category: 'creative' },
];

export const categorizedInterests = interests.reduce((acc, interest) => {
  if (!acc[interest.category]) {
    acc[interest.category] = [];
  }
  acc[interest.category].push(interest);
  return acc;
}, {} as Record<string, Interest[]>);
