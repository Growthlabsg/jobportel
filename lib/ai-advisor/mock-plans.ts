import { AIAdvisorPlan } from '@/types/platform';

export const aiAdvisorPlans: AIAdvisorPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    credits: 5,
    features: [
      '5 AI Advisor sessions',
      'Idea validation',
      'Basic business guidance',
      'Market analysis reports',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29.99,
    credits: 20,
    features: [
      '20 AI Advisor sessions',
      'Unlimited idea validation',
      'Advanced business guidance',
      'Detailed market analysis',
      'Competitive analysis',
      'Risk assessment',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    credits: 100,
    features: [
      '100 AI Advisor sessions',
      'Everything in Professional',
      'Priority support',
      'Custom analysis reports',
      'API access',
      'Team collaboration',
    ],
  },
];

