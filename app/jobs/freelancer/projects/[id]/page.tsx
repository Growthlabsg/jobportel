'use client';

import { useState, useEffect } from 'react';
import { useProject, useSubmitProposal, useMyFreelancerProfile } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  Send,
  ArrowLeft,
  Share2,
  Heart,
  Eye,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CreateProposalData } from '@/types/freelancer';
import { PaymentProtectionBadge } from '@/components/freelancer/PaymentProtectionBadge';
import { MilestoneTracker } from '@/components/freelancer/MilestoneTracker';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { data: project, isLoading } = useProject(projectId);
  const { data: myProfile } = useMyFreelancerProfile();
  const submitProposal = useSubmitProposal();
  
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [proposalData, setProposalData] = useState<Partial<CreateProposalData>>({
    coverLetter: '',
    proposedRate: undefined,
    proposedBudget: undefined,
    estimatedHours: undefined,
    estimatedCompletionDate: '',
  });

  // Load saved status from localStorage
  useEffect(() => {
    if (projectId && typeof window !== 'undefined') {
      const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
      setIsSaved(savedProjects.includes(projectId));
    }
  }, [projectId]);

  const toggleSave = () => {
    if (!projectId || typeof window === 'undefined') return;
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    if (isSaved) {
      const updated = savedProjects.filter((id: string) => id !== projectId);
      localStorage.setItem('savedProjects', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      savedProjects.push(projectId);
      localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title || 'Project',
          text: project?.description || '',
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleSubmitProposal = async () => {
    if (!project || !proposalData.coverLetter || !proposalData.estimatedCompletionDate) {
      alert('Please fill in all required fields (Cover Letter and Estimated Completion Date)');
      return;
    }

    if (project.type === 'fixed-price' && !proposalData.proposedBudget) {
      alert('Please enter your proposed budget for this fixed-price project');
      return;
    }

    if (project.type === 'hourly' && (!proposalData.proposedRate || !proposalData.estimatedHours)) {
      alert('Please enter your hourly rate and estimated hours for this hourly project');
      return;
    }

    const data: CreateProposalData = {
      projectId: project.id,
      coverLetter: proposalData.coverLetter,
      proposedRate: project.type === 'hourly' ? proposalData.proposedRate : undefined,
      proposedBudget: project.type === 'fixed-price' ? proposalData.proposedBudget : undefined,
      estimatedHours: project.type === 'hourly' ? proposalData.estimatedHours : undefined,
      estimatedCompletionDate: proposalData.estimatedCompletionDate,
    };

    try {
      const result = await submitProposal.mutateAsync(data);
      if (result) {
        alert('Proposal submitted successfully!');
        setShowProposalModal(false);
        router.push('/jobs/freelancer/projects');
      } else {
        alert('Failed to submit proposal. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('An error occurred while submitting your proposal. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Project Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/jobs/freelancer/projects">
            <Button>Browse Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <Link href="/jobs/freelancer/projects">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {project.title}
                      </h1>
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={toggleSave}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title={isSaved ? 'Remove from saved' : 'Save project'}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              isSaved
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          />
                        </button>
                        <button
                          onClick={handleShare}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Share project"
                        >
                          <Share2 className="w-5 h-5 text-gray-400 hover:text-primary" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{project.clientName}</span>
                      </div>
                      {project.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{project.location}</span>
                        </div>
                      )}
                      {project.remote && (
                        <Badge variant="outline">Remote</Badge>
                      )}
                    </div>
                  </div>
                  {project.featured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Project Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Required Skills</h3>
                    <div className="flex items-center gap-2">
                      {project.paymentProtection && (
                        <PaymentProtectionBadge enabled={project.paymentProtection} />
                      )}
                      {project.requiresVerification && (
                        <Badge variant="info" className="text-xs">
                          Verified Only
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="primary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.milestones && project.milestones.length > 0 && (
                  <div className="mb-6">
                    <MilestoneTracker 
                      milestones={project.milestones}
                      canManage={false}
                    />
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Project Type</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {project.type === 'fixed-price' ? 'Fixed Price' : 'Hourly'}
                      </p>
                    </div>
                    {project.type === 'fixed-price' && project.budget && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          ${project.budget.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {project.type === 'hourly' && project.hourlyRate && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hourly Rate</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            ${project.hourlyRate.min || 0} - ${project.hourlyRate.max || 0}/hr
                          </p>
                        </div>
                        {project.estimatedHours && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Hours</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {project.estimatedHours} hours
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Proposals</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {project.proposalsCount} proposals
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Posted</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-700 sticky top-4">
              <CardContent className="p-6">
                <div className="mb-6">
                  {project.type === 'fixed-price' && project.budget && (
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-primary mb-1">
                        ${project.budget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fixed Price</div>
                    </div>
                  )}
                  {project.type === 'hourly' && project.hourlyRate && (
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-primary mb-1">
                        ${project.hourlyRate.min || 0}-${project.hourlyRate.max || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Per Hour</div>
                    </div>
                  )}
                </div>

                {myProfile ? (
                  <Button
                    className="w-full mb-4"
                    onClick={() => setShowProposalModal(true)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </Button>
                ) : (
                  <Link href="/jobs/freelancer/profile">
                    <Button className="w-full mb-4">
                      <User className="w-4 h-4 mr-2" />
                      Create Profile to Apply
                    </Button>
                  </Link>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Proposals</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{project.proposalsCount}</span>
                      {project.proposalsCount > 0 && (
                        <Link href={`/jobs/freelancer/projects/${projectId}/proposals`}>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hired</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{project.hiredFreelancers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  {project.subcategory && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subcategory</span>
                      <Badge variant="outline" className="text-xs">
                        {project.subcategory}
                      </Badge>
                    </div>
                  )}
                  {project.paymentProtection && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment</span>
                      <PaymentProtectionBadge enabled={project.paymentProtection} variant="compact" />
                    </div>
                  )}
                  {project.connectsRequired && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Connects Required</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {project.connectsRequired}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Posted</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {project.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expires</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(project.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      <Modal
        isOpen={showProposalModal}
        title="Submit Proposal"
        onClose={() => setShowProposalModal(false)}
      >
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitProposal(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Letter *
              </label>
              <Textarea
                placeholder="Explain why you're the best fit for this project..."
                rows={8}
                value={proposalData.coverLetter}
                onChange={(e) => setProposalData(prev => ({ ...prev, coverLetter: e.target.value }))}
                required
              />
            </div>

            {project.type === 'fixed-price' && (
              <div>
                <Input
                  type="number"
                  label="Your Proposed Budget (USD)"
                  placeholder="e.g., 2500"
                  value={proposalData.proposedBudget || ''}
                  onChange={(e) => setProposalData(prev => ({ ...prev, proposedBudget: e.target.value ? Number(e.target.value) : undefined }))}
                />
              </div>
            )}

            {project.type === 'hourly' && (
              <>
                <div>
                  <Input
                    type="number"
                    label="Your Hourly Rate (USD)"
                    placeholder="e.g., 50"
                    value={proposalData.proposedRate || ''}
                    onChange={(e) => setProposalData(prev => ({ ...prev, proposedRate: e.target.value ? Number(e.target.value) : undefined }))}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Estimated Hours"
                    placeholder="e.g., 40"
                    value={proposalData.estimatedHours || ''}
                    onChange={(e) => setProposalData(prev => ({ ...prev, estimatedHours: e.target.value ? Number(e.target.value) : undefined }))}
                  />
                </div>
              </>
            )}

            <div>
              <Input
                type="date"
                label="Estimated Completion Date"
                value={proposalData.estimatedCompletionDate}
                onChange={(e) => setProposalData(prev => ({ ...prev, estimatedCompletionDate: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowProposalModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitProposal}
                isLoading={submitProposal.isPending}
                disabled={!proposalData.coverLetter}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Proposal
              </Button>
            </div>
          </form>
        </Modal>
    </div>
  );
}

