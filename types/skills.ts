export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  verified: boolean;
}

export interface SkillAssessment {
  id: string;
  skillId: string;
  skillName: string;
  userId: string;
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  testResults?: {
    questions: number;
    correct: number;
    timeSpent: number;
    date: string;
  };
  certifications?: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
  }[];
  projects?: {
    name: string;
    description: string;
    url?: string;
    technologies: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillTest {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  questions: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'coding' | 'practical';
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
    points: number;
  }[];
  timeLimit?: number; // in minutes
  passingScore: number;
  description: string;
  estimatedTime: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  icon?: string;
}

