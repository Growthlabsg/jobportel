export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export const EXPERIENCE_LEVELS = [
  'Entry',
  'Junior',
  'Mid',
  'Mid-level',
  'Senior',
  'Expert',
  'Team Lead',
  'Manager',
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const APPLICATION_STATUSES = [
  'Submitted',
  'Reviewed',
  'Shortlisted',
  'Interviewing',
  'Offered',
  'Hired',
  'Rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const JOB_STATUSES = [
  'Draft',
  'Published',
  'Paused',
  'Closed',
  'Archived',
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const INTERVIEW_TYPES = [
  'Phone',
  'Video',
  'In-person',
  'Technical',
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const LOCATIONS = [
  'Remote',
  'Hybrid',
  'Singapore',
  'San Francisco',
  'New York',
  'London',
  'Berlin',
  'Tokyo',
  'Sydney',
  'Toronto',
  'Dubai',
  'Bangalore',
  'Hong Kong',
  'Seoul',
  'Amsterdam',
  'Paris',
  'Tel Aviv',
  'Austin',
  'Boston',
  'Seattle',
  'Asia Pacific',
  'Europe',
  'North America',
  'South America',
  'Middle East',
  'Africa',
  'Oceania',
] as const;

export type Location = (typeof LOCATIONS)[number];

export const ALERT_FREQUENCIES = [
  'Daily',
  'Weekly',
  'Monthly',
] as const;

export type AlertFrequency = (typeof ALERT_FREQUENCIES)[number];

export const CURRENCIES = [
  'SGD',
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CNY',
  'HKD',
  'AUD',
  'CAD',
  'CHF',
  'INR',
  'MYR',
  'THB',
  'IDR',
  'PHP',
  'VND',
  'KRW',
  'NZD',
  'BRL',
  'MXN',
  'ZAR',
  'AED',
  'SAR',
  'ILS',
  'TRY',
  'PLN',
  'SEK',
  'NOK',
  'DKK',
  'RUB',
] as const;

export type Currency = (typeof CURRENCIES)[number];

export const INDUSTRIES = [
  'Technology',
  'Fintech',
  'Healthcare',
  'E-commerce',
  'SaaS',
  'AI/ML',
  'Blockchain',
  'EdTech',
  'Biotech',
  'Gaming',
  'Media',
  'Real Estate',
  'Food & Beverage',
  'Travel',
  'Transportation',
  'Energy',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Marketing',
  'Other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

export type CompanySize = (typeof COMPANY_SIZES)[number];

export const FUNDING_STAGES = [
  'Bootstrapped',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'IPO',
] as const;

export type FundingStage = (typeof FUNDING_STAGES)[number];

export const JOB_CATEGORIES = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
  'HR',
  'Business Development',
  'Customer Success',
  'Data Science',
  'DevOps',
  'Security',
  'QA',
  'Content',
  'Legal',
  'Other',
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const JOB_SUBCATEGORIES: Record<string, string[]> = {
  Engineering: [
    'Frontend',
    'Backend',
    'Full Stack',
    'Mobile',
    'DevOps',
    'QA',
    'Security',
    'Data Engineering',
    'ML Engineering',
    'Infrastructure',
  ],
  Product: [
    'Product Manager',
    'Product Owner',
    'Product Designer',
    'Product Analyst',
    'Technical Product Manager',
  ],
  Design: [
    'UI/UX Designer',
    'Graphic Designer',
    'Product Designer',
    'Visual Designer',
    'Interaction Designer',
    'Design Systems',
  ],
  Marketing: [
    'Digital Marketing',
    'Content Marketing',
    'Growth Marketing',
    'Brand Marketing',
    'Performance Marketing',
    'SEO/SEM',
    'Social Media',
  ],
  Sales: [
    'Account Executive',
    'Sales Development',
    'Sales Manager',
    'Business Development',
    'Inside Sales',
    'Enterprise Sales',
  ],
  Operations: [
    'Operations Manager',
    'Business Operations',
    'Supply Chain',
    'Logistics',
    'Process Improvement',
  ],
  Finance: [
    'Financial Analyst',
    'Accountant',
    'Controller',
    'CFO',
    'FP&A',
  ],
  HR: [
    'Recruiter',
    'HR Manager',
    'People Operations',
    'Talent Acquisition',
    'HR Business Partner',
  ],
  'Business Development': [
    'Partnerships',
    'Strategic Partnerships',
    'Channel Partnerships',
    'Business Development Manager',
  ],
  'Customer Success': [
    'Customer Success Manager',
    'Customer Support',
    'Account Manager',
    'Technical Support',
  ],
  'Data Science': [
    'Data Scientist',
    'Data Analyst',
    'Business Analyst',
    'Machine Learning',
    'AI Research',
  ],
  DevOps: [
    'DevOps Engineer',
    'Site Reliability Engineer',
    'Cloud Engineer',
    'Infrastructure Engineer',
  ],
  Security: [
    'Security Engineer',
    'Security Analyst',
    'Information Security',
    'Cybersecurity',
  ],
  QA: [
    'QA Engineer',
    'Test Engineer',
    'QA Automation',
    'Quality Assurance',
  ],
  Content: [
    'Content Writer',
    'Content Strategist',
    'Copywriter',
    'Technical Writer',
    'Editor',
  ],
  Legal: [
    'Legal Counsel',
    'Compliance',
    'Legal Operations',
  ],
  Other: [
    'General',
    'Administrative',
    'Executive',
  ],
};

export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'Swift',
  'Kotlin',
  'PHP',
  'Ruby',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'GraphQL',
  'REST API',
  'Microservices',
  'Machine Learning',
  'Deep Learning',
  'Data Science',
  'DevOps',
  'CI/CD',
  'Git',
  'Agile',
  'Scrum',
  'Product Management',
  'UI/UX Design',
  'Figma',
  'Sketch',
  'Adobe XD',
] as const;

export const COMMON_BENEFITS = [
  'Health Insurance',
  'Dental Insurance',
  'Vision Insurance',
  'Stock Options',
  'Equity',
  '401k / Retirement Plan',
  'Flexible Hours',
  'Remote Work',
  'Work From Home',
  'Unlimited PTO',
  'Paid Time Off',
  'Maternity Leave',
  'Paternity Leave',
  'Learning Budget',
  'Conference Budget',
  'Gym Membership',
  'Free Meals',
  'Snacks & Drinks',
  'Team Events',
  'Career Development',
] as const;

export const RESUME_TEMPLATES = [
  'Modern',
  'Classic',
  'Creative',
] as const;

export type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];

