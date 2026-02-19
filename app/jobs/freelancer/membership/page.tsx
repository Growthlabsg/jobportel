'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { Check, X, ArrowLeft, Home, Crown, Zap, Building2, Briefcase, CreditCard } from 'lucide-react';
import { MembershipTier } from '@/types/freelancer';
import Link from 'next/link';

const membershipPlans = [
  {
    tier: 'basic' as MembershipTier,
    name: 'Basic',
    icon: Briefcase,
    price: 0,
    period: 'Free',
    description: 'Perfect for getting started',
    features: [
      '10 Connects per month',
      'Basic profile visibility',
      'Standard support',
      'Access to all projects',
      'Basic analytics',
    ],
    limitations: [
      'Limited proposal submissions',
      'No priority support',
    ],
    color: 'gray',
  },
  {
    tier: 'plus' as MembershipTier,
    name: 'Plus',
    icon: Zap,
    price: 14.99,
    period: 'per month',
    description: 'For serious freelancers',
    features: [
      '60 Connects per month',
      'Enhanced profile visibility',
      'Priority support',
      'Advanced analytics',
      'Proposal insights',
      'Job alerts',
      'AI-powered recommendations',
      'No service fee on first $500',
    ],
    limitations: [],
    color: 'blue',
    popular: true,
  },
  {
    tier: 'business' as MembershipTier,
    name: 'Business',
    icon: Building2,
    price: 29.99,
    period: 'per month',
    description: 'For growing businesses',
    features: [
      '140 Connects per month',
      'Maximum profile visibility',
      '24/7 Priority support',
      'Advanced analytics & insights',
      'Team collaboration tools',
      'Talent pool access',
      'Direct contracts',
      'Reduced service fees',
      'API access',
    ],
    limitations: [],
    color: 'purple',
  },
  {
    tier: 'enterprise' as MembershipTier,
    name: 'Enterprise',
    icon: Crown,
    price: 0,
    period: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited Connects',
      'Dedicated account manager',
      'Custom integrations',
      'Workforce compliance tools',
      'Global payroll support',
      'Advanced security',
      'White-label options',
      'Custom pricing',
    ],
    limitations: [],
    color: 'yellow',
    custom: true,
  },
];

export default function MembershipPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);

  const handleUpgrade = (tier: MembershipTier) => {
    // In a real app, this would integrate with payment processing
    alert(`Upgrade to ${tier} plan - Payment integration would go here`);
    setSelectedTier(tier);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/jobs/freelancer')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Membership Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose the plan that works best for you. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Current Plan Badge */}
        <div className="mb-8">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Plan</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic (Free)</p>
                </div>
                <Badge variant="primary">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {membershipPlans.map((plan) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            
            return (
              <Card
                key={plan.tier}
                className={`border-2 transition-all relative ${
                  isPopular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/30'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" className="px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-${plan.color}-100 dark:bg-${plan.color}-900/30`}>
                      <Icon className={`w-6 h-6 text-${plan.color}-600 dark:text-${plan.color}-400`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                        {plan.name}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    {plan.custom ? (
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Custom</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Contact sales</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          ${plan.price}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          /{plan.period}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={isPopular ? 'primary' : 'outline'}
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={plan.tier === 'basic'}
                  >
                    {plan.tier === 'basic' ? 'Current Plan' : plan.custom ? 'Contact Sales' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What are Connects?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connects are credits used to submit proposals for projects. Each project requires a certain number of Connects.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Do unused Connects roll over?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unused Connects roll over to the next month, up to a maximum limit based on your plan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

