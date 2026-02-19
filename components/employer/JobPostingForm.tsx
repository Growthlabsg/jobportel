'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, Save, Eye } from 'lucide-react';
import { CreateJobData } from '@/types/job';
import { JOB_TYPES, EXPERIENCE_LEVELS, LOCATIONS, CURRENCIES, JOB_CATEGORIES, JOB_SUBCATEGORIES } from '@/lib/constants';
import { StartupSelector } from '@/components/platform/StartupSelector';
import { useCanPostJobsForStartup } from '@/hooks/usePermissions';
import { AlertCircle } from 'lucide-react';
import { getCurrencyForLocation } from '@/lib/currency-region';

const jobPostingSchema = z.object({
  // Step 1: Basic Information
  title: z.string().min(5, 'Job title must be at least 5 characters'),
  companyId: z.string().min(1, 'Company is required'),
  department: z.string().optional(),
  reportingStructure: z.string().optional(),
  teamSize: z.number().optional(),

  // Step 2: Job Details
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']),
  experienceLevel: z.enum(['Entry', 'Junior', 'Mid', 'Mid-level', 'Senior', 'Expert', 'Team Lead', 'Manager']),
  location: z.enum(LOCATIONS),
  remoteWork: z.enum(['On-site', 'Remote', 'Hybrid']),
  workSchedule: z.string().optional(),
  jobCategory: z.string().optional(),
  subCategory: z.string().optional(),

  // Step 3: Compensation
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z.string().optional(),
  equity: z.string().optional(),
  stockOptions: z.string().optional(),
  bonus: z.string().optional(),

  // Step 4: Job Description
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  education: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),

  // Step 5: Benefits
  benefits: z.array(z.string()).optional(),

  // Step 6: Work Environment
  companyValues: z.string().optional(),
  workEnvironment: z.string().optional(),
  teamCulture: z.string().optional(),
  growthOpportunities: z.string().optional(),

  // Step 7: Requirements
  workAuthorization: z.boolean().optional(),
  backgroundCheck: z.boolean().optional(),
  drugTest: z.boolean().optional(),
  securityClearance: z.boolean().optional(),
  travelRequired: z.boolean().optional(),
  visaSponsorship: z.boolean().optional(),

  // Step 8: Application Process
  applicationMethod: z.enum(['Platform', 'External']),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  applicationEmail: z.string().email().optional().or(z.literal('')),
  interviewProcess: z.string().optional(),
  timeline: z.string().optional(),

  // Step 9: Visibility
  featured: z.boolean(),
  urgency: z.enum(['High', 'Medium', 'Low']),
  deadline: z.string().optional(),
  startDate: z.string().optional(),
});

type JobPostingFormData = z.infer<typeof jobPostingSchema>;

interface JobPostingFormProps {
  onSubmit: (data: CreateJobData) => void;
  initialData?: Partial<CreateJobData>;
  onSaveDraft?: (data: Partial<CreateJobData>) => void;
  jobId?: string; // For editing existing jobs
}

const STEPS = [
  'Basic Information',
  'Job Details',
  'Compensation',
  'Job Description',
  'Benefits & Perks',
  'Work Environment',
  'Requirements',
  'Application Process',
  'Visibility',
];

export const JobPostingForm = ({ onSubmit, initialData, onSaveDraft, jobId }: JobPostingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(
    initialData?.companyId || null
  );
  
  // Check permissions for selected startup
  const { data: canPostJobs, isLoading: checkingPermissions } = useCanPostJobsForStartup(selectedStartupId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      featured: false,
      urgency: 'Medium',
      applicationMethod: 'Platform',
      ...initialData,
    },
  });

  const watchedSkills = watch('skills') || [];
  const watchedRequirements = watch('requirements') || [];
  const watchedBenefits = watch('benefits') || [];
  const watchedLocation = watch('location');
  
  // Auto-detect currency based on location
  useEffect(() => {
    if (watchedLocation) {
      const detectedCurrency = getCurrencyForLocation(watchedLocation);
      const currentCurrency = getValues('currency');
      // Only update if currency hasn't been manually set or is different
      if (!currentCurrency || currentCurrency !== detectedCurrency) {
        setValue('currency', detectedCurrency);
      }
    }
  }, [watchedLocation, setValue, getValues]);

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = getValues('skills') || [];
      setValue('skills', [...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = getValues('skills') || [];
    setValue('skills', currentSkills.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      const currentRequirements = getValues('requirements') || [];
      setValue('requirements', [...currentRequirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    const currentRequirements = getValues('requirements') || [];
    setValue('requirements', currentRequirements.filter((_, i) => i !== index));
  };

  const toggleBenefit = (benefit: string) => {
    const currentBenefits = getValues('benefits') || [];
    if (currentBenefits.includes(benefit)) {
      setValue('benefits', currentBenefits.filter((b) => b !== benefit));
    } else {
      setValue('benefits', [...currentBenefits, benefit]);
    }
  };

  const handleSaveDraft = () => {
    const formData = getValues();
    onSaveDraft?.(formData as any);
  };

  const onFormSubmit = (data: JobPostingFormData) => {
    // Check permissions before submitting
    if (selectedStartupId && canPostJobs === false) {
      alert('You do not have permission to post jobs for this startup. Please contact the startup administrator.');
      return;
    }
    
    const jobData: CreateJobData = {
      ...data,
      requirements: data.requirements || [],
      education: data.education || [],
      certifications: data.certifications || [],
      languages: data.languages || [],
      benefits: data.benefits || [],
      salary: data.salaryMin && data.salaryMax
        ? {
            min: data.salaryMin,
            max: data.salaryMax,
            currency: (data.currency || (typeof window !== 'undefined' ? getCurrencyForLocation(data.location || '') : 'USD')) as any,
          }
        : undefined,
    };
    onSubmit(jobData);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Job Title"
              {...register('title')}
              error={errors.title?.message}
              required
            />
            <StartupSelector
              value={selectedStartupId || undefined}
              onChange={(startupId) => {
                setSelectedStartupId(startupId);
                setValue('companyId', startupId || '');
              }}
              required
              label="Startup/Company"
            />
            {errors.companyId && (
              <p className="text-sm text-red-500 mt-1">{errors.companyId.message}</p>
            )}
            {selectedStartupId && !checkingPermissions && canPostJobs === false && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Permission Required</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    You don&apos;t have permission to post jobs for this startup. Please contact the startup administrator or select a different startup.
                  </p>
                </div>
              </div>
            )}
            <Input
              label="Department"
              {...register('department')}
              error={errors.department?.message}
            />
            <Input
              label="Reporting Structure"
              {...register('reportingStructure')}
              error={errors.reportingStructure?.message}
            />
            <Input
              label="Team Size"
              type="number"
              {...register('teamSize', { valueAsNumber: true })}
              error={errors.teamSize?.message}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('jobType')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                {...register('experienceLevel')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                {...register('location')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remote Work <span className="text-red-500">*</span>
              </label>
              <select
                {...register('remoteWork')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <Input
              label="Work Schedule"
              {...register('workSchedule')}
              error={errors.workSchedule?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Category
              </label>
              <select
                {...register('jobCategory')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                {JOB_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {(() => {
              const selectedCategory = watch('jobCategory');
              return selectedCategory && JOB_SUBCATEGORIES[selectedCategory] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category
                  </label>
                  <select
                    {...register('subCategory')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a sub-category</option>
                    {JOB_SUBCATEGORIES[selectedCategory].map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })()}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Salary"
                type="number"
                {...register('salaryMin', { valueAsNumber: true })}
                error={errors.salaryMin?.message}
              />
              <Input
                label="Max Salary"
                type="number"
                {...register('salaryMax', { valueAsNumber: true })}
                error={errors.salaryMax?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                {...register('currency')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Equity"
              {...register('equity')}
              error={errors.equity?.message}
            />
            <Input
              label="Stock Options"
              {...register('stockOptions')}
              error={errors.stockOptions?.message}
            />
            <Input
              label="Bonus Structure"
              {...register('bonus')}
              error={errors.bonus?.message}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add a requirement and press Enter"
                />
                <Button type="button" onClick={addRequirement}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedRequirements.map((req, index) => (
                  <Badge key={index} variant="default" className="flex items-center gap-1">
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add a skill and press Enter"
                />
                <Button type="button" onClick={addSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedSkills.map((skill, index) => (
                  <Badge key={index} variant="primary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
              )}
            </div>
          </div>
        );

      case 5:
        const commonBenefits = [
          'Health Insurance',
          'Dental Insurance',
          'Vision Insurance',
          'Retirement Plans',
          'PTO',
          'Learning Budget',
          'Conference Budget',
          'Gym Membership',
          'Meal Allowance',
          'Transportation',
          'Parking',
        ];
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Select the benefits and perks offered with this position
            </p>
            <div className="grid grid-cols-2 gap-3">
              {commonBenefits.map((benefit) => (
                <label
                  key={benefit}
                  className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={watchedBenefits.includes(benefit)}
                    onChange={() => toggleBenefit(benefit)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Values
              </label>
              <textarea
                {...register('companyValues')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your company values..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Environment
              </label>
              <textarea
                {...register('workEnvironment')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe the work environment..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Culture</label>
              <textarea
                {...register('teamCulture')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your team culture..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Growth Opportunities
              </label>
              <textarea
                {...register('growthOpportunities')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe growth and development opportunities..."
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Work Requirements</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('workAuthorization')}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Work Authorization Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('backgroundCheck')}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Background Check Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('drugTest')}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Drug Test Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('securityClearance')}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Security Clearance Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('travelRequired')}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Travel Required</span>
                </label>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Visa & Sponsorship</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('visaSponsorship')}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Offers Visa Sponsorship</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Check this if your company is willing to sponsor work visas for international candidates
              </p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Method <span className="text-red-500">*</span>
              </label>
              <select
                {...register('applicationMethod')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Platform">Platform (Use Growth Lab Application Form)</option>
                <option value="External">External (Redirect to External URL/Email)</option>
              </select>
            </div>
            {watch('applicationMethod') === 'External' && (
              <>
                <Input
                  label="Application URL"
                  {...register('applicationUrl')}
                  error={errors.applicationUrl?.message}
                  placeholder="https://..."
                />
                <Input
                  label="Application Email"
                  type="email"
                  {...register('applicationEmail')}
                  error={errors.applicationEmail?.message}
                  placeholder="jobs@company.com"
                />
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Process
              </label>
              <textarea
                {...register('interviewProcess')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe the interview process..."
              />
            </div>
            <Input
              label="Timeline Expectations"
              {...register('timeline')}
              error={errors.timeline?.message}
              placeholder="e.g., 2-3 weeks"
            />
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Feature this job</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <select
                {...register('urgency')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <Input
              label="Application Deadline"
              type="date"
              {...register('deadline')}
              error={errors.deadline?.message}
            />
            <Input
              label="Start Date"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{STEPS[currentStep - 1]}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1]}</CardTitle>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-1" />
            Save Draft
          </Button>
        </div>
        <div className="flex gap-2">
          {currentStep < STEPS.length ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={!!(selectedStartupId && canPostJobs === false)}
              title={selectedStartupId && canPostJobs === false ? 'You do not have permission to post jobs for this startup' : ''}
            >
              <Eye className="h-4 w-4 mr-1" />
              {jobId ? 'Update Job' : 'Publish Job'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

