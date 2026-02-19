'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProject } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { DollarSign, Clock, MapPin, Tag, FileText, Plus, X, Shield, CheckCircle2, ArrowLeft, Home, Trophy } from 'lucide-react';
import { CreateProjectData, ProjectType } from '@/types/freelancer';
import { PaymentProtectionBadge } from '@/components/freelancer/PaymentProtectionBadge';
import Link from 'next/link';

const projectSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  type: z.enum(['fixed-price', 'hourly', 'contest']),
  budget: z.number().optional(),
  hourlyRateMin: z.number().optional(),
  hourlyRateMax: z.number().optional(),
  estimatedHours: z.number().optional(),
  location: z.string().optional(),
  remote: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const categories = [
  'Web Development',
  'Mobile App Development',
  'Design',
  'Writing',
  'Marketing',
  'Data Science',
  'DevOps',
  'Other',
];

const popularSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'UI/UX', 'Figma',
  'Graphic Design', 'Content Writing', 'SEO', 'Social Media', 'Data Analysis',
];

export default function PostProjectPage() {
  const router = useRouter();
  const [projectType, setProjectType] = useState<ProjectType>('fixed-price');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [paymentProtection, setPaymentProtection] = useState(true);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [connectsRequired, setConnectsRequired] = useState(2);
  const [contestPrize, setContestPrize] = useState<number>(0);
  const [contestWinners, setContestWinners] = useState<number>(1);
  const [contestEndDate, setContestEndDate] = useState<string>('');
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      type: 'fixed-price',
      remote: true,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    const projectData: CreateProjectData = {
      title: data.title,
      description: data.description,
      category: data.category,
      skills: skills,
      type: projectType,
      budget: projectType === 'fixed-price' ? data.budget : (projectType === 'contest' ? contestPrize : undefined),
      hourlyRate: projectType === 'hourly' ? {
        min: data.hourlyRateMin,
        max: data.hourlyRateMax,
      } : undefined,
      estimatedHours: projectType === 'hourly' ? data.estimatedHours : undefined,
      location: data.location,
      remote: data.remote,
      paymentProtection,
      requiresVerification,
      connectsRequired,
      // Contest fields
      contestPrize: projectType === 'contest' ? contestPrize : undefined,
      contestWinners: projectType === 'contest' ? contestWinners : undefined,
      contestEndDate: projectType === 'contest' ? contestEndDate : undefined,
    };

    try {
      const result = await createProject.mutateAsync(projectData);
      if (result) {
        router.push(`/jobs/freelancer/projects/${result.id}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Link href="/jobs/freelancer">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Post a Project</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Describe your project and find the perfect freelancer
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-2 border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Input
                  label="Project Title"
                  placeholder="e.g., Build a mobile app for iOS and Android"
                  {...register('title')}
                  error={errors.title?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your project in detail. What do you need? What are the requirements?"
                  rows={8}
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  {...register('category')}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" onClick={() => addSkill(skillInput)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map(skill => (
                    <Badge key={skill} variant="primary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Popular skills:</div>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.filter(s => !skills.includes(s)).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.skills.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Project Type & Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Project Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setProjectType('fixed-price');
                      setValue('type', 'fixed-price');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      projectType === 'fixed-price'
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-gray-900 dark:text-gray-100">Fixed Price</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Pay a fixed amount for the project</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectType('hourly');
                      setValue('type', 'hourly');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      projectType === 'hourly'
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-gray-900 dark:text-gray-100">Hourly</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Pay by the hour</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectType('contest');
                      setValue('type', 'contest');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      projectType === 'contest'
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-gray-900 dark:text-gray-100">Contest</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Crowdsource solutions</div>
                  </button>
                </div>
              </div>

              {projectType === 'fixed-price' ? (
                <div>
                  <Input
                    type="number"
                    label="Budget (USD)"
                    placeholder="e.g., 5000"
                    {...register('budget', { valueAsNumber: true })}
                    error={errors.budget?.message}
                  />
                </div>
              ) : projectType === 'contest' ? (
                <div className="space-y-4">
                  <Input
                    type="number"
                    label="Prize Pool (USD)"
                    placeholder="e.g., 1000"
                    value={contestPrize || ''}
                    onChange={(e) => setContestPrize(Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    label="Number of Winners"
                    placeholder="e.g., 3"
                    value={contestWinners || ''}
                    onChange={(e) => setContestWinners(Number(e.target.value))}
                    min={1}
                  />
                  <Input
                    type="date"
                    label="Contest End Date"
                    value={contestEndDate}
                    onChange={(e) => setContestEndDate(e.target.value)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Hourly Rate Min (USD)"
                    placeholder="e.g., 25"
                    {...register('hourlyRateMin', { valueAsNumber: true })}
                    error={errors.hourlyRateMin?.message}
                  />
                  <Input
                    type="number"
                    label="Hourly Rate Max (USD)"
                    placeholder="e.g., 50"
                    {...register('hourlyRateMax', { valueAsNumber: true })}
                    error={errors.hourlyRateMax?.message}
                  />
                  <div className="col-span-2">
                    <Input
                      type="number"
                      label="Estimated Hours"
                      placeholder="e.g., 40"
                      {...register('estimatedHours', { valueAsNumber: true })}
                      error={errors.estimatedHours?.message}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Location & Work Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    {...register('remote')}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remote work allowed
                  </span>
                </label>
              </div>

              <div>
                <Input
                  label="Location (Optional)"
                  placeholder="e.g., Remote or San Francisco, USA"
                  {...register('location')}
                  error={errors.location?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment & Security Settings */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Payment & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-green-50 dark:bg-green-900/10">
                <input
                  type="checkbox"
                  id="paymentProtection"
                  checked={paymentProtection}
                  onChange={(e) => setPaymentProtection(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div className="flex-1">
                  <label htmlFor="paymentProtection" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Enable Payment Protection (Escrow)
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Funds are held in escrow and released only when milestones are completed. This protects both you and the freelancer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="requiresVerification"
                  checked={requiresVerification}
                  onChange={(e) => setRequiresVerification(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div className="flex-1">
                  <label htmlFor="requiresVerification" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Require Verified Freelancers Only
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Only freelancers with verified profiles and identity verification can submit proposals.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Connects Required (1-5)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={connectsRequired}
                  onChange={(e) => setConnectsRequired(parseInt(e.target.value) || 1)}
                  className="w-32"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Number of connects freelancers need to spend to submit a proposal. Higher values reduce low-quality proposals.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createProject.isPending}
            >
              Post Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

