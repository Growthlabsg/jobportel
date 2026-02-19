export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string;
  profile: {
    headline: string;
    summary: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  skills: string[];
  certifications: PortfolioCertification[];
  achievements: PortfolioAchievement[];
  testimonials: PortfolioTestimonial[];
  visibility: 'Public' | 'Private' | 'Unlisted';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  featured: boolean;
  category: string;
}

export interface PortfolioExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies?: string[];
}

export interface PortfolioEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  honors?: string[];
  description?: string;
}

export interface PortfolioCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
}

export interface PortfolioAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  url?: string;
}

export interface PortfolioTestimonial {
  id: string;
  author: string;
  authorRole: string;
  authorCompany: string;
  authorAvatar?: string;
  content: string;
  rating: number;
  date: string;
  verified: boolean;
}

