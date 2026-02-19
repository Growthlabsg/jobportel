'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Job } from '@/types/job';
import { formatCurrency } from '@/lib/utils';
import { 
  UserPlus, 
  Share2,
  Mail,
  Copy,
  CheckCircle,
  Clock,
  TrendingUp,
  Gift,
  Users,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

interface Referral {
  id: string;
  job: Job;
  referredTo: string;
  email: string;
  status: 'pending' | 'viewed' | 'applied' | 'hired';
  referredAt: string;
  reward?: {
    amount: number;
    currency: string;
    status: 'pending' | 'paid';
  };
}

// Mock data
const mockReferrals: Referral[] = [
  {
    id: '1',
    job: {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: {
        id: '1',
        name: 'TechNova Solutions',
        logo: undefined,
      },
      location: 'Singapore',
      jobType: 'Full-time',
      experienceLevel: 'Senior',
      salary: {
        min: 8000,
        max: 12000,
        currency: 'USD',
      },
      description: 'We\'re looking for an experienced full stack developer...',
      requirements: [],
      skills: [],
      benefits: [],
      remoteWork: 'Remote',
      visaSponsorship: true,
      featured: true,
      urgency: 'High',
      status: 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    referredTo: 'John Doe',
    email: 'john.doe@example.com',
    status: 'applied',
    referredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    reward: {
      amount: 500,
      currency: 'USD',
      status: 'pending',
    },
  },
  {
    id: '2',
    job: {
      id: '2',
      title: 'Product Manager',
      company: {
        id: '2',
        name: 'GreenTech Solutions',
        logo: undefined,
      },
      location: 'Singapore',
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      salary: {
        min: 7000,
        max: 10000,
        currency: 'USD',
      },
      description: 'Drive product strategy...',
      requirements: [],
      skills: [],
      benefits: [],
      remoteWork: 'Hybrid',
      visaSponsorship: false,
      featured: false,
      urgency: 'Medium',
      status: 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    referredTo: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'viewed',
    referredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '3',
    job: {
      id: '3',
      title: 'Frontend Developer',
      company: {
        id: '3',
        name: 'DesignHub',
        logo: undefined,
      },
      location: 'Singapore',
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      salary: {
        min: 6000,
        max: 9000,
        currency: 'USD',
      },
      description: 'Join our frontend team...',
      requirements: [],
      skills: [],
      benefits: [],
      remoteWork: 'Remote',
      visaSponsorship: true,
      featured: false,
      urgency: 'Low',
      status: 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    referredTo: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    status: 'pending',
    referredAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

function ReferralsContent() {
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [showReferForm, setShowReferForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [referralEmail, setReferralEmail] = useState('');
  const [referralName, setReferralName] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleReferJob = (job: Job) => {
    setSelectedJob(job);
    setShowReferForm(true);
  };

  const handleSubmitReferral = () => {
    if (!referralEmail || !referralName || !selectedJob) {
      alert('Please fill in all fields');
      return;
    }

    const newReferral: Referral = {
      id: Date.now().toString(),
      job: selectedJob,
      referredTo: referralName,
      email: referralEmail,
      status: 'pending',
      referredAt: new Date().toISOString(),
    };

    setReferrals([newReferral, ...referrals]);
    setShowReferForm(false);
    setReferralEmail('');
    setReferralName('');
    setSelectedJob(null);
    alert('Referral sent successfully!');
  };

  const handleCopyReferralLink = (jobId: string) => {
    const link = `${window.location.origin}/jobs/find-startup-jobs?job=${jobId}&ref=${Date.now()}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(jobId);
    setTimeout(() => setCopiedLink(null), 2000);
    alert('Referral link copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired':
        return 'success';
      case 'applied':
        return 'primary';
      case 'viewed':
        return 'info';
      default:
        return 'default';
    }
  };

  const totalReferrals = referrals.length;
  const successfulReferrals = referrals.filter((r) => r.status === 'hired').length;
  const pendingRewards = referrals.filter(
    (r) => r.reward && r.reward.status === 'pending'
  ).length;
  const totalRewards = referrals
    .filter((r) => r.reward && r.reward.status === 'paid')
    .reduce((sum, r) => sum + (r.reward?.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Job Referrals</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Refer jobs to friends and earn rewards when they get hired
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalReferrals}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Successful Hires</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{successfulReferrals}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Rewards</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingRewards}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalRewards, 'USD')}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Program Info */}
        <Card className="border-primary/20 bg-primary/5 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold mb-1">1. Refer a Friend</p>
                    <p>Share job links with qualified candidates</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">2. They Apply</p>
                    <p>Your referral applies through the shared link</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">3. Earn Rewards</p>
                    <p>Get rewarded when they get hired (typically $200-$1000)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {referrals.map((referral) => (
                <div key={referral.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {referral.job.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {referral.job.company.name} • {referral.job.location}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>Referred to: {referral.referredTo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{referral.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getStatusColor(referral.status) as any}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </Badge>
                          {referral.reward && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Reward</p>
                              <p className="font-semibold text-primary">
                                {formatCurrency(referral.reward.amount, referral.reward.currency)}
                              </p>
                              <Badge
                                variant={referral.reward.status === 'paid' ? 'success' : 'warning'}
                                size="sm"
                              >
                                {referral.reward.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyReferralLink(referral.job.id)}
                        >
                          {copiedLink === referral.job.id ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </>
                          )}
                        </Button>
                        <Link href={`/jobs/find-startup-jobs?job=${referral.job.id}`}>
                          <Button variant="outline" size="sm">
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Refer Section */}
        <Card className="border-gray-200 mt-6">
          <CardHeader>
            <CardTitle>Quick Refer a Job</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Have a job in mind? Enter the job ID or search for jobs to refer.
            </p>
            <div className="flex gap-3">
              <Input
                placeholder="Enter job ID or search..."
                className="flex-1"
              />
              <Button variant="outline" onClick={() => setShowReferForm(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Refer Job
              </Button>
              <Link href="/jobs/find-startup-jobs">
                <Button>
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Form Modal */}
      {showReferForm && (
        <Modal
          isOpen={showReferForm}
          onClose={() => {
            setShowReferForm(false);
            setSelectedJob(null);
            setReferralEmail('');
            setReferralName('');
          }}
          title="Refer a Job"
          size="md"
        >
          <div className="space-y-4">
            {selectedJob && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{selectedJob.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.company.name}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Friend&apos;s Name
              </label>
              <Input
                value={referralName}
                onChange={(e) => setReferralName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Friend&apos;s Email
              </label>
              <Input
                type="email"
                value={referralEmail}
                onChange={(e) => setReferralEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  An email with the job details and application link will be sent to your friend.
                  You&apos;ll be notified when they apply or get hired.
                </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReferForm(false);
                  setSelectedJob(null);
                  setReferralEmail('');
                  setReferralName('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitReferral}>
                <Mail className="h-4 w-4 mr-2" />
                Send Referral
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function ReferralsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading referrals...</p>
        </div>
      </div>
    }>
      <ReferralsContent />
    </Suspense>
  );
}

