import { Hackathon, Prize, Judge, JudgingCriteria } from '@/types/platform';

export const mockHackathons: Hackathon[] = [
  {
    id: 'hack1',
    name: 'Climate Innovation Challenge 2024',
    slug: 'climate-innovation-challenge-2024',
    description: 'Build solutions to combat climate change and create sustainable impact. Join 500+ innovators in this global hackathon.',
    longDescription: `
      The Climate Innovation Challenge is a month-long hackathon focused on developing innovative solutions to address climate change. 
      Teams will work on projects ranging from carbon tracking, renewable energy solutions, sustainable agriculture, and more.
      
      This hackathon brings together entrepreneurs, developers, designers, and climate enthusiasts from around the world to create 
      impactful solutions that can make a real difference.
      
      Winners will receive mentorship, funding opportunities, and exposure to investors and climate tech leaders.
    `,
    theme: 'Climate Tech & Sustainability',
    organizer: 'Growth Lab',
    organizerLogo: 'https://via.placeholder.com/100',
    
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    registrationDeadline: '2024-11-25T23:59:59Z',
    judgingDate: '2025-01-05T00:00:00Z',
    
    prizes: [
      {
        id: 'prize1',
        hackathonId: 'hack1',
        rank: 1,
        title: 'Grand Prize',
        amount: '$10,000',
        description: 'Cash prize + mentorship + investor connections',
        sponsor: 'GreenTech Ventures',
      },
      {
        id: 'prize2',
        hackathonId: 'hack1',
        rank: 2,
        title: 'Second Place',
        amount: '$5,000',
        description: 'Cash prize + mentorship',
      },
      {
        id: 'prize3',
        hackathonId: 'hack1',
        rank: 3,
        title: 'Third Place',
        amount: '$2,500',
        description: 'Cash prize',
      },
      {
        id: 'prize4',
        hackathonId: 'hack1',
        rank: 0,
        title: 'Best Innovation',
        amount: '$1,000',
        description: 'Most innovative solution',
      },
    ],
    totalPrizePool: '$18,500',
    
    teamSize: {
      min: 2,
      max: 5,
    },
    requiredSkills: ['Development', 'Design', 'Business'],
    preferredIndustries: ['Climate Tech', 'SaaS', 'Sustainability'],
    
    status: 'upcoming',
    visibility: 'public',
    
    registeredTeams: ['1', '2'],
    maxParticipants: 100,
    currentParticipants: 45,
    
    judges: [
      {
        id: 'judge1',
        hackathonId: 'hack1',
        name: 'Dr. Jane Smith',
        title: 'Climate Tech Investor',
        company: 'GreenTech Ventures',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        bio: 'Leading investor in climate tech startups',
        linkedinUrl: '#',
      },
      {
        id: 'judge2',
        hackathonId: 'hack1',
        name: 'Michael Chen',
        title: 'Sustainability Expert',
        company: 'Climate Solutions Inc',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        bio: '20+ years in sustainable technology',
      },
    ],
    
    criteria: [
      {
        id: 'criteria1',
        hackathonId: 'hack1',
        category: 'Innovation',
        weight: 30,
        description: 'Uniqueness and creativity of the solution',
      },
      {
        id: 'criteria2',
        hackathonId: 'hack1',
        category: 'Impact',
        weight: 40,
        description: 'Potential environmental and social impact',
      },
      {
        id: 'criteria3',
        hackathonId: 'hack1',
        category: 'Feasibility',
        weight: 20,
        description: 'Technical feasibility and implementation potential',
      },
      {
        id: 'criteria4',
        hackathonId: 'hack1',
        category: 'Presentation',
        weight: 10,
        description: 'Quality of pitch and demonstration',
      },
    ],
    
    spotlightEligible: true,
    featuredWinners: [],
    
    tags: ['Climate', 'Sustainability', 'Tech', 'Innovation'],
    location: 'Global (Remote)',
    remoteParticipation: true,
    imageUrl: 'https://via.placeholder.com/800x400?text=Climate+Innovation+Challenge',
    bannerUrl: 'https://via.placeholder.com/1200x300?text=Climate+Innovation+Challenge+2024',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: 'hack2',
    name: 'EdTech Innovation Sprint',
    slug: 'edtech-innovation-sprint',
    description: 'Create the future of education technology. Build tools that transform how people learn.',
    longDescription: `
      The EdTech Innovation Sprint is a fast-paced hackathon focused on educational technology solutions.
      Teams will develop innovative learning platforms, tools, and applications that can improve education outcomes.
    `,
    theme: 'Education Technology',
    organizer: 'Growth Lab',
    
    startDate: '2025-01-15T00:00:00Z',
    endDate: '2025-01-22T23:59:59Z',
    registrationDeadline: '2025-01-10T23:59:59Z',
    
    prizes: [
      {
        id: 'prize5',
        hackathonId: 'hack2',
        rank: 1,
        title: 'Grand Prize',
        amount: '$7,500',
        description: 'Cash prize + mentorship',
      },
      {
        id: 'prize6',
        hackathonId: 'hack2',
        rank: 2,
        title: 'Second Place',
        amount: '$3,000',
      },
    ],
    totalPrizePool: '$10,500',
    
    teamSize: {
      min: 2,
      max: 4,
    },
    preferredIndustries: ['EdTech', 'SaaS'],
    
    status: 'upcoming',
    visibility: 'public',
    
    registeredTeams: ['2'],
    maxParticipants: 50,
    currentParticipants: 12,
    
    spotlightEligible: true,
    
    tags: ['EdTech', 'Education', 'Learning'],
    location: 'Global (Remote)',
    remoteParticipation: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: 'hack3',
    name: 'AI for Good Hackathon',
    slug: 'ai-for-good-hackathon',
    description: 'Leverage AI to solve real-world problems and create positive social impact.',
    theme: 'AI & Social Impact',
    organizer: 'Growth Lab',
    
    startDate: '2024-11-10T00:00:00Z',
    endDate: '2024-11-17T23:59:59Z',
    registrationDeadline: '2024-11-05T23:59:59Z',
    
    prizes: [
      {
        id: 'prize7',
        hackathonId: 'hack3',
        rank: 1,
        title: 'Grand Prize',
        amount: '$8,000',
      },
    ],
    totalPrizePool: '$8,000',
    
    teamSize: {
      min: 2,
      max: 6,
    },
    
    status: 'completed',
    visibility: 'public',
    
    registeredTeams: [],
    currentParticipants: 0,
    
    spotlightEligible: true,
    featuredWinners: ['1'],
    
    tags: ['AI', 'Machine Learning', 'Social Impact'],
    location: 'Global (Remote)',
    remoteParticipation: true,
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
  },
];

