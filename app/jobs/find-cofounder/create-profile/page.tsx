'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  UserCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  Lightbulb,
  TrendingUp,
  Video,
  Calendar,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { CoFounderProfile, IdeaStatus, IdeaPreference, TechnicalPreference, TimingPreference, LocationPreference, Importance } from '@/types/cofounder';
import { useCofounder } from '@/contexts/CofounderContext';

const RESPONSIBILITY_AREAS = [
  'Product',
  'Engineering',
  'Design',
  'Sales & Marketing',
  'Operations',
  'Finance',
  'Strategy',
  'Customer Success',
];

const INDUSTRIES = [
  'Agriculture/Agtech',
  'Artificial Intelligence',
  'Augmented Reality/Virtual Reality',
  'B2B/Enterprise',
  'Biomedical/Biotech',
  'Blockchain',
  'Climate/Sustainability',
  'Consumer',
  'E-Commerce',
  'Developer Tools',
  'Education/Edtech',
  'Energy',
  'Entertainment',
  'Financial/Fintech',
  'Food/Beverage',
  'Gaming',
  'Government',
  'Hardware',
  'Hard Tech',
  'Health/Wellness',
  'Healthcare',
  'Marketplace',
  'Non-Profit',
  'Real Estate/Proptech',
  'Robotics',
  'Security',
  'Travel/Tourism',
];

const REFERRAL_SOURCES = [
  'Social Media',
  'Friend/Colleague',
  'Search Engine',
  'Event/Conference',
  'Newsletter',
  'Other',
];

const FULL_TIME_TIMING_OPTIONS = [
  "I'm already full-time on my startup",
  "I'm ready to go full-time as soon as I meet the right co-founder",
  "I'm planning to go full-time in the next year",
  "I don't have any specific plans yet",
];

const IDEA_STATUS_OPTIONS = [
  "Yes, I'm committed to an idea and I want a co-founder who can help me build it",
  "I have some ideas, but I'm also open to exploring other ideas",
  "No, I could help a co-founder with their existing idea or explore new ideas together",
];

const INTEREST_MATCHING_OPTIONS = [
  "I only want to match with co-founders who share my interests",
  "I prefer to match with co-founders who share my interests, but it's not required",
  "No preference",
];

const TIMING_PREFERENCE_OPTIONS = [
  "I only want to see co-founders who match my timing",
  "I prefer to see co-founders who match my timing, but it's not required",
  "No preference",
];

const LOCATION_PREFERENCE_OPTIONS = [
  "Within a certain distance of me",
  "In my country",
  "In my region",
  "No preference",
];

const TECHNICAL_OPTIONS = [
  "Yes - I am a programmer, scientist or engineer who can build the product without outside assistance",
  "No",
];

const IMPORTANCE_OPTIONS = [
  "Preferred but not required",
  "Required",
];

export default function CreateProfilePage() {
  const router = useRouter();
  const { addProfile, setCurrentProfile } = useCofounder();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CoFounderProfile>>({
    skills: [],
    values: [],
    goals: [],
    industry: [],
    responsibilityAreas: [],
    languages: ['English'],
    preferences: {
      ageRange: [25, 45],
      experienceLevel: [],
      location: [],
      availability: [],
      skills: [],
      values: [],
    },
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (path: string[], value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev: any) => {
      const current = prev[field] || [];
      const updated = current.includes(item)
        ? current.filter((i: string) => i !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = () => {
    const profile: CoFounderProfile = {
      id: `profile_${Date.now()}`,
      name: formData.name || '',
      email: formData.email || '',
      location: formData.location || '',
      timezone: formData.timezone,
      languages: formData.languages || ['English'],
      experience: formData.experience || 'intermediate',
      availability: formData.availability || 'full-time',
      industry: formData.industry || [],
      skills: formData.skills || [],
      interests: formData.interests || [],
      values: formData.values || [],
      goals: formData.goals || [],
      fundingStage: formData.fundingStage || 'idea',
      teamSize: formData.teamSize || 'solo',
      commitment: formData.commitment || 'high',
      riskTolerance: formData.riskTolerance || 'medium',
      workStyle: formData.workStyle || 'collaborative',
      communication: formData.communication || 'direct',
      bio: formData.bio,
      lookingFor: formData.whatLookingFor,
      achievements: formData.accomplishments,
      education: formData.education,
      previousStartups: formData.previousStartups || 0,
      network: [],
      technicalStatus: formData.technicalStatus || false,
      cofounderStatus: true,
      responsibilityAreas: formData.responsibilityAreas || [],
      preferences: formData.preferences || {
        ageRange: [25, 45],
        experienceLevel: [],
        location: [],
        availability: [],
        skills: [],
        values: [],
      },
      compatibilityScores: {},
      lastActive: new Date(),
      isVerified: false,
      isPremium: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...formData,
    };

    addProfile(profile);
    setCurrentProfile(profile);
    router.push('/jobs/find-cofounder');
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!(
          formData.name &&
          formData.email &&
          formData.location &&
          formData.bio &&
          formData.accomplishments &&
          formData.accomplishments.length > 0 &&
          formData.accomplishments[0] &&
          formData.employmentHistory &&
          formData.employmentHistory.length > 0 &&
          formData.employmentHistory[0] &&
          formData.technicalStatus !== undefined
        );
      case 2:
        return !!(
          formData.startupIdeaStatus &&
          formData.responsibilityAreas &&
          formData.responsibilityAreas.length > 0 &&
          formData.industry &&
          formData.industry.length > 0 &&
          formData.fullTimeTiming
        );
      case 3:
        return !!(
          formData.whatLookingFor &&
          formData.ideaPreference &&
          formData.ideaPreferenceImportance &&
          formData.technicalPreference &&
          formData.technicalPreferenceImportance &&
          formData.timingPreference &&
          formData.locationPreference &&
          formData.locationPreferenceImportance &&
          formData.preferredResponsibilityAreas &&
          formData.preferredResponsibilityAreas.length > 0
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4">
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">Create Profile</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white mb-3 gradient-text">
                Create Your Co-Founder Profile
              </h1>
              <p className="text-base text-[#64748B] dark:text-gray-400">
                Step {step} of 3
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    {step === 1 && (
                      <Step1BasicDetails
                        formData={formData}
                        updateField={updateField}
                      />
                    )}
                    {step === 2 && (
                      <Step2AdditionalDetails
                        formData={formData}
                        updateField={updateField}
                        toggleArrayItem={toggleArrayItem}
                      />
                    )}
                    {step === 3 && (
                      <Step3Preferences
                        formData={formData}
                        updateField={updateField}
                        toggleArrayItem={toggleArrayItem}
                      />
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200/60">
                      {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                      ) : (
                        <div />
                      )}
                      {step < 3 ? (
                        <Button
                          onClick={() => setStep(step + 1)}
                          disabled={!isStepValid()}
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button onClick={handleSubmit} disabled={!isStepValid()}>
                          Complete Profile
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 sticky top-24">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-[#1E293B] dark:text-white mb-4">
                        Profile Preview
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-[#64748B] dark:text-gray-400">Name:</span>{' '}
                          <span className="font-medium">{formData.name || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-[#64748B] dark:text-gray-400">Location:</span>{' '}
                          <span className="font-medium">{formData.location || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-[#64748B] dark:text-gray-400">Skills:</span>{' '}
                          <span className="font-medium">
                            {formData.responsibilityAreas?.length || 0} areas
                          </span>
                        </div>
                        <div>
                          <span className="text-[#64748B] dark:text-gray-400">Industries:</span>{' '}
                          <span className="font-medium">
                            {formData.industry?.length || 0} selected
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200/60 pt-6">
                      <h3 className="text-sm font-bold text-[#1E293B] dark:text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Tips for Success
                      </h3>
                      <ul className="space-y-2 text-xs text-[#64748B] dark:text-gray-400">
                        <li>• Be specific and honest about your background</li>
                        <li>• Clearly describe what you&apos;re looking for</li>
                        <li>• Highlight your unique accomplishments</li>
                        <li>• Select industries you&apos;re passionate about</li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-200/60 pt-6 mt-6">
                      <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-gray-400 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="font-medium">Platform Stats</span>
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-gray-400 space-y-1">
                        <div>Total Candidates: 8,613</div>
                        <div>Matching Preferences: 32</div>
                        <div>Response Rate: 87%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step1BasicDetails({
  formData,
  updateField,
}: {
  formData: Partial<CoFounderProfile>;
  updateField: (field: string, value: any) => void;
}) {
  const [accomplishments, setAccomplishments] = useState<string[]>(
    formData.accomplishments && formData.accomplishments.length > 0
      ? formData.accomplishments
      : ['']
  );
  const [employmentHistory, setEmploymentHistory] = useState<string[]>(
    formData.employmentHistory && formData.employmentHistory.length > 0
      ? formData.employmentHistory
      : ['']
  );
  const [hasLinkedIn, setHasLinkedIn] = useState(true);
  const [firstName, setFirstName] = useState(formData.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(formData.name?.split(' ').slice(1).join(' ') || '');

  const updateName = (first: string, last: string) => {
    const fullName = first && last ? `${first} ${last}` : first || last;
    updateField('name', fullName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-6">
          Step 1: Basic Details
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              updateName(e.target.value, lastName);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              updateName(firstName, e.target.value);
            }}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="noLinkedIn"
            checked={!hasLinkedIn}
            onChange={(e) => {
              setHasLinkedIn(!e.target.checked);
              if (e.target.checked) {
                updateField('linkedin', '');
              }
            }}
            className="rounded border-gray-300"
          />
          <label htmlFor="noLinkedIn" className="text-sm text-[#64748B] dark:text-gray-400">
            I don&apos;t have a LinkedIn profile
          </label>
        </div>
        {hasLinkedIn && (
          <div>
            <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
              LinkedIn URL
            </label>
            <Input
              value={formData.linkedin || ''}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Location (City, Country) <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="e.g., New York, USA or London, UK"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Introduce yourself! <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-2">
            ({formData.bio?.length || 0}/500)
          </span>
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={4}
          maxLength={500}
          value={formData.bio || ''}
          onChange={(e) => updateField('bio', e.target.value)}
          placeholder="Tell us about yourself, your background, and what drives you..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          (Optional) 1-minute video introducing yourself (YouTube/Vimeo URL)
        </label>
        <Input
          value={formData.videoIntroduction || ''}
          onChange={(e) => updateField('videoIntroduction', e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Impressive accomplishment <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={3}
          value={accomplishments[0] || ''}
          onChange={(e) => {
            const updated = [...accomplishments];
            updated[0] = e.target.value;
            setAccomplishments(updated);
            updateField('accomplishments', updated.filter(Boolean));
          }}
          placeholder="Describe your most impressive accomplishment..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Another impressive accomplishment
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={3}
          value={accomplishments[1] || ''}
          onChange={(e) => {
            const updated = [...accomplishments];
            if (updated.length < 2) updated.push('');
            updated[1] = e.target.value;
            setAccomplishments(updated);
            updateField('accomplishments', updated.filter(Boolean));
          }}
          placeholder="Describe another impressive accomplishment..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Employment: employers, position/titles, and dates <span className="text-red-500">*</span>
        </label>
        {employmentHistory.map((emp, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <textarea
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={2}
              value={emp}
              onChange={(e) => {
                const updated = [...employmentHistory];
                updated[idx] = e.target.value;
                setEmploymentHistory(updated);
                updateField('employmentHistory', updated.filter(Boolean));
              }}
              placeholder="Company, Position/Title, Dates (e.g., Google, Software Engineer, 2020-2023)"
              required={idx === 0}
            />
            {employmentHistory.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updated = employmentHistory.filter((_, i) => i !== idx);
                  setEmploymentHistory(updated);
                  updateField('employmentHistory', updated);
                }}
                className="self-start"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEmploymentHistory([...employmentHistory, '']);
          }}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employment
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Are you technical? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {TECHNICAL_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="technical"
                value={option}
                checked={
                  (option.includes('Yes') && formData.technicalStatus === true) ||
                  (option.includes('No') && formData.technicalStatus === false)
                }
                onChange={(e) => {
                  updateField('technicalStatus', e.target.value.includes('Yes'));
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-[#64748B] dark:text-gray-400">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          (Optional) Scheduling URL (Calendly, Cal, or Google Calendar)
        </label>
        <Input
          value={formData.schedulingUrl || ''}
          onChange={(e) => updateField('schedulingUrl', e.target.value)}
          placeholder="https://calendly.com/yourname"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
            (Optional) Twitter URL
          </label>
          <Input
            value={formData.twitter || ''}
            onChange={(e) => updateField('twitter', e.target.value)}
            placeholder="https://twitter.com/yourhandle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
            (Optional) Instagram URL
          </label>
          <Input
            value={formData.instagram || ''}
            onChange={(e) => updateField('instagram', e.target.value)}
            placeholder="https://instagram.com/yourhandle"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          How did you hear about GrowthLab Co-Founder Matching?
        </label>
        <select
          value={formData.additionalInfo || ''}
          onChange={(e) => updateField('additionalInfo', e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Select...</option>
          {REFERRAL_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Step2AdditionalDetails({
  formData,
  updateField,
  toggleArrayItem,
}: {
  formData: Partial<CoFounderProfile>;
  updateField: (field: string, value: any) => void;
  toggleArrayItem: (field: string, item: string) => void;
}) {
  const [hasStartup, setHasStartup] = useState(
    formData.startupIdeaStatus === 'committed' || formData.startupIdeaStatus === 'exploring'
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-6">
          Step 2: Additional Details
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Do you already have a startup or idea that you&apos;re set on? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {IDEA_STATUS_OPTIONS.map((option) => (
            <label key={option} className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="startupIdeaStatus"
                value={option}
                checked={formData.startupIdeaStatus === option}
                onChange={(e) => {
                  const status = e.target.value;
                  const isCommitted = status === IDEA_STATUS_OPTIONS[0];
                  const isExploring = status === IDEA_STATUS_OPTIONS[1];
                  setHasStartup(isCommitted || isExploring);
                  updateField('startupIdeaStatus', status);
                  if (!isCommitted && !isExploring) {
                    updateField('companyName', '');
                    updateField('companyDescription', '');
                    updateField('progressDescription', '');
                    updateField('fundingRaised', '');
                  }
                }}
                className="mt-1 rounded border-gray-300"
              />
              <span className="text-sm text-[#64748B] dark:text-gray-400">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {hasStartup && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
              What is the name of your company or project? <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.companyName || ''}
              onChange={(e) => updateField('companyName', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
              Describe your company or project in a few sentences <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 ml-2">
                ({formData.companyDescription?.length || 0}/500, minimum 10)
              </span>
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={4}
              maxLength={500}
              minLength={10}
              value={formData.companyDescription || ''}
              onChange={(e) => updateField('companyDescription', e.target.value)}
              placeholder="Describe your startup idea or company..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
              (Optional) How long have you been working on this and what progress have you made? (500 characters)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={3}
              maxLength={500}
              value={formData.progressDescription || ''}
              onChange={(e) => updateField('progressDescription', e.target.value)}
              placeholder="Describe your progress..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
              (Optional) If you&apos;ve already raised funding for this startup, who invested and how much have you raised?
            </label>
            <Input
              value={formData.fundingRaised || ''}
              onChange={(e) => updateField('fundingRaised', e.target.value)}
              placeholder="e.g., $500K from Y Combinator"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Do you already have a co-founder? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasCofounder"
              checked={formData.cofounderStatus === false}
              onChange={() => updateField('cofounderStatus', false)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasCofounder"
              checked={formData.cofounderStatus !== false}
              onChange={() => updateField('cofounderStatus', true)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">No</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          When do you want to start working on a startup full-time? <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.fullTimeTiming || ''}
          onChange={(e) => updateField('fullTimeTiming', e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        >
          <option value="">Select...</option>
          {FULL_TIME_TIMING_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Which areas of a startup are you willing to take responsibility for? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {RESPONSIBILITY_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleArrayItem('responsibilityAreas', area)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.responsibilityAreas?.includes(area)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 dark:border-gray-700 text-[#64748B] hover:border-primary/50'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Which topics and industries are you interested in? <span className="text-red-500">*</span>
        </label>
        <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry}
                type="button"
                onClick={() => toggleArrayItem('industry', industry)}
                className={`p-2 rounded text-xs font-medium transition-all text-left ${
                  formData.industry?.includes(industry)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-[#64748B] hover:bg-primary/10'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          What are your expectations for splitting equity? (250 characters)
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={2}
          maxLength={250}
          value={formData.equityExpectations || ''}
          onChange={(e) => updateField('equityExpectations', e.target.value)}
          placeholder="Describe your equity expectations..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          What do you do with your free time? (500 characters)
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={3}
          maxLength={500}
          value={formData.freeTimeDescription || ''}
          onChange={(e) => updateField('freeTimeDescription', e.target.value)}
          placeholder="What do you enjoy doing in your free time?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          How did your life path lead to where you are now? (500 characters)
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={3}
          maxLength={500}
          value={formData.lifePathStory || ''}
          onChange={(e) => updateField('lifePathStory', e.target.value)}
          placeholder="Tell us your story..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Anything else you would like to add about yourself?
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={4}
          value={formData.additionalInfo || ''}
          onChange={(e) => updateField('additionalInfo', e.target.value)}
          placeholder="Any additional information you'd like to share..."
        />
      </div>
    </div>
  );
}

function Step3Preferences({
  formData,
  updateField,
  toggleArrayItem,
}: {
  formData: Partial<CoFounderProfile>;
  updateField: (field: string, value: any) => void;
  toggleArrayItem: (field: string, item: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-6">
          Step 3: Co-founder Preferences
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          What are you looking for in a co-founder?
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={4}
          value={formData.whatLookingFor || ''}
          onChange={(e) => updateField('whatLookingFor', e.target.value)}
          placeholder="Describe the ideal co-founder you're looking for..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Are you looking for a co-founder who already has a specific idea, or are you open to exploring new ideas together? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 mb-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="ideaPreference"
              value="specific"
              checked={formData.ideaPreference === 'specific'}
              onChange={(e) => updateField('ideaPreference', e.target.value)}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">I want to see co-founders who have a specific idea</span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="ideaPreference"
              value="open"
              checked={formData.ideaPreference === 'open'}
              onChange={(e) => updateField('ideaPreference', e.target.value)}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">I want to see co-founders who are not set on a specific idea</span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="ideaPreference"
              value="no-preference"
              checked={formData.ideaPreference === 'no-preference'}
              onChange={(e) => updateField('ideaPreference', e.target.value)}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">No preference</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
            How important is this to you? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.ideaPreferenceImportance || ''}
            onChange={(e) => updateField('ideaPreferenceImportance', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          >
            <option value="">Select...</option>
            {IMPORTANCE_OPTIONS.map((option) => (
              <option key={option} value={option.toLowerCase().replace(' ', '-')}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Do you prefer either technical or non-technical profiles? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 mb-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="technicalPreference"
              value="technical"
              checked={formData.technicalPreference === 'technical'}
              onChange={(e) => updateField('technicalPreference', e.target.value)}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">Technical</span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="technicalPreference"
              value="non-technical"
              checked={formData.technicalPreference === 'non-technical'}
              onChange={(e) => updateField('technicalPreference', e.target.value)}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">Non-technical</span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="technicalPreference"
              value="no-preference"
              checked={formData.technicalPreference === 'no-preference'}
              onChange={(e) => updateField('technicalPreference', e.target.value)}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">No preference</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
            How important is this to you? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.technicalPreferenceImportance || ''}
            onChange={(e) => updateField('technicalPreferenceImportance', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          >
            <option value="">Select...</option>
            {IMPORTANCE_OPTIONS.map((option) => (
              <option key={option} value={option.toLowerCase().replace(' ', '-')}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Do you prefer to see co-founders who match up with your timing? <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.timingPreference || ''}
          onChange={(e) => updateField('timingPreference', e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        >
          <option value="">Select...</option>
          {TIMING_PREFERENCE_OPTIONS.map((option) => (
            <option key={option} value={option.toLowerCase().replace(/[^a-z0-9-]/g, '-')}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Do you have a location preference? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 mb-3">
          {LOCATION_PREFERENCE_OPTIONS.map((option) => (
            <label key={option} className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="locationPreference"
                value={option.toLowerCase().replace(/[^a-z0-9-]/g, '-')}
                checked={formData.locationPreference === option.toLowerCase().replace(/[^a-z0-9-]/g, '-')}
                onChange={(e) => updateField('locationPreference', e.target.value)}
                className="mt-1 rounded border-gray-300"
              />
              <span className="text-sm text-[#64748B] dark:text-gray-400">{option}</span>
            </label>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
            How important is this to you? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.locationPreferenceImportance || ''}
            onChange={(e) => updateField('locationPreferenceImportance', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          >
            <option value="">Select...</option>
            {IMPORTANCE_OPTIONS.map((option) => (
              <option key={option} value={option.toLowerCase().replace(' ', '-')}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Do you have an age preference? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 mb-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="agePreference"
              value="range"
              checked={formData.agePreference !== null}
              onChange={() => {
                if (!formData.agePreference) {
                  updateField('agePreference', [25, 45]);
                }
              }}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">Within a certain age range</span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="agePreference"
              value="no-preference"
              checked={formData.agePreference === null}
              onChange={() => updateField('agePreference', null)}
              className="mt-1 rounded border-gray-300"
            />
            <span className="text-sm text-[#64748B] dark:text-gray-400">No preference</span>
          </label>
        </div>
        {formData.agePreference !== null && (
          <div className="flex items-center gap-4">
            <Input
              type="number"
              label="Min Age"
              value={formData.agePreference?.[0] || ''}
              onChange={(e) =>
                updateField('agePreference', [
                  parseInt(e.target.value) || 25,
                  formData.agePreference?.[1] || 45,
                ])
              }
              className="w-24"
            />
            <span className="text-[#64748B]">to</span>
            <Input
              type="number"
              label="Max Age"
              value={formData.agePreference?.[1] || ''}
              onChange={(e) =>
                updateField('agePreference', [
                  formData.agePreference?.[0] || 25,
                  parseInt(e.target.value) || 45,
                ])
              }
              className="w-24"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Which areas would you like a co-founder to take responsibility for? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {RESPONSIBILITY_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleArrayItem('preferredResponsibilityAreas', area)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.preferredResponsibilityAreas?.includes(area)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 dark:border-gray-700 text-[#64748B] hover:border-primary/50'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
          Do you prefer to match candidates who share your interests? <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.interestMatchingPreference !== undefined ? String(formData.interestMatchingPreference) : ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'only') {
              updateField('interestMatchingPreference', true);
            } else if (value === 'prefer') {
              updateField('interestMatchingPreference', true);
            } else {
              updateField('interestMatchingPreference', false);
            }
          }}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        >
          <option value="">Select...</option>
          {INTEREST_MATCHING_OPTIONS.map((option) => (
            <option key={option} value={option.includes('only') ? 'only' : option.includes('prefer') ? 'prefer' : 'no-preference'}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="alertMatches"
          checked={formData.alertForNewMatches || false}
          onChange={(e) => updateField('alertForNewMatches', e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="alertMatches" className="text-sm text-[#64748B] dark:text-gray-400">
          Alert me when a new profile that matches all my preferences joins
        </label>
      </div>
    </div>
  );
}
