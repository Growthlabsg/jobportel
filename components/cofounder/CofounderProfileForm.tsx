'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

/** Form-specific shape (nested) used by this component; can be mapped to CoFounderProfile elsewhere */
export interface CofounderProfileFormData {
  id?: string;
  userId?: string;
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    timezone?: string;
    linkedin?: string;
    portfolio?: string;
    website?: string;
  };
  skills?: {
    technical: string[];
    business: string[];
    design: string[];
    marketing: string[];
  };
  experience?: {
    level: string;
    years: number;
    industries: string[];
    previousStartups: number;
  };
  availability?: {
    type: string;
    hoursPerWeek: number;
    startDate: string;
  };
  commitment?: {
    level: string;
    equityExpectation: string;
    salaryExpectation: string;
  };
  lookingFor?: {
    description: string;
    roles: string[];
    industries: string[];
    companyStage: string;
  };
  values?: string[];
  languages?: string[] | { name: string; proficiency: string }[];
  createdAt?: string;
  updatedAt?: string;
}

interface CofounderProfileFormProps {
  initialData?: Partial<CofounderProfileFormData>;
  onSubmit: (data: CofounderProfileFormData) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Your basic information' },
  { id: 2, title: 'Skills & Experience', description: 'Your expertise' },
  { id: 3, title: 'Availability', description: 'Time commitment' },
  { id: 4, title: 'Looking For', description: 'What you need' },
  { id: 5, title: 'Values & Preferences', description: 'Your principles' },
];

export const CofounderProfileForm = ({
  initialData,
  onSubmit,
  onCancel,
}: CofounderProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CofounderProfileFormData>>({
    personalInfo: {
      firstName: initialData?.personalInfo?.firstName || '',
      lastName: initialData?.personalInfo?.lastName || '',
      email: initialData?.personalInfo?.email || '',
      location: initialData?.personalInfo?.location || 'Singapore',
      timezone: initialData?.personalInfo?.timezone || 'SGT (UTC+8)',
      linkedin: initialData?.personalInfo?.linkedin || '',
      portfolio: initialData?.personalInfo?.portfolio || '',
      website: initialData?.personalInfo?.website || '',
    },
    skills: {
      technical: initialData?.skills?.technical || [],
      business: initialData?.skills?.business || [],
      design: initialData?.skills?.design || [],
      marketing: initialData?.skills?.marketing || [],
    },
    experience: {
      level: initialData?.experience?.level || 'Mid',
      years: initialData?.experience?.years || 0,
      industries: initialData?.experience?.industries || [],
      previousStartups: initialData?.experience?.previousStartups || 0,
    },
    availability: {
      type: initialData?.availability?.type || 'Full-time',
      hoursPerWeek: initialData?.availability?.hoursPerWeek || 40,
      startDate: initialData?.availability?.startDate || '',
    },
    commitment: {
      level: initialData?.commitment?.level || 'High',
      equityExpectation: initialData?.commitment?.equityExpectation || '',
      salaryExpectation: initialData?.commitment?.salaryExpectation || '',
    },
    lookingFor: {
      description: initialData?.lookingFor?.description || '',
      roles: initialData?.lookingFor?.roles || [],
      industries: initialData?.lookingFor?.industries || [],
      companyStage: initialData?.lookingFor?.companyStage || 'Idea',
    },
    values: initialData?.values || [],
    languages: initialData?.languages || [],
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const profile: CofounderProfileFormData = {
      id: initialData?.id || Date.now().toString(),
      userId: initialData?.userId || 'current-user',
      personalInfo: formData.personalInfo!,
      skills: formData.skills!,
      experience: formData.experience!,
      availability: formData.availability!,
      commitment: formData.commitment!,
      lookingFor: formData.lookingFor!,
      values: formData.values || [],
      languages: formData.languages || [],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(profile);
  };

  const updateField = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((currentStep / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6 min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <Input
                    value={formData.personalInfo?.firstName || ''}
                    onChange={(e) => updateField('personalInfo.firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <Input
                    value={formData.personalInfo?.lastName || ''}
                    onChange={(e) => updateField('personalInfo.lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.personalInfo?.email || ''}
                  onChange={(e) => updateField('personalInfo.email', e.target.value)}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <Input
                    value={formData.personalInfo?.location || ''}
                    onChange={(e) => updateField('personalInfo.location', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone *</label>
                  <Input
                    value={formData.personalInfo?.timezone || ''}
                    onChange={(e) => updateField('personalInfo.timezone', e.target.value)}
                    placeholder="SGT (UTC+8)"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <Input
                    type="url"
                    value={formData.personalInfo?.linkedin || ''}
                    onChange={(e) => updateField('personalInfo.linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                  <Input
                    type="url"
                    value={formData.personalInfo?.portfolio || ''}
                    onChange={(e) => updateField('personalInfo.portfolio', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <Input
                    type="url"
                    value={formData.personalInfo?.website || ''}
                    onChange={(e) => updateField('personalInfo.website', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills & Experience</h2>
              
              {/* Technical Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills (comma-separated)
                </label>
                <Input
                  placeholder="React, Node.js, Python, AWS..."
                  value={formData.skills?.technical?.join(', ') || ''}
                  onChange={(e) =>
                    updateField(
                      'skills.technical',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>

              {/* Business Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Skills (comma-separated)
                </label>
                <Input
                  placeholder="Product Strategy, Sales, Marketing..."
                  value={formData.skills?.business?.join(', ') || ''}
                  onChange={(e) =>
                    updateField(
                      'skills.business',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>

              {/* Experience Level */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                  <select
                    value={formData.experience?.level || 'Mid'}
                    onChange={(e) => updateField('experience.level', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Entry">Entry</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <Input
                    type="number"
                    value={formData.experience?.years || 0}
                    onChange={(e) => updateField('experience.years', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              {/* Industries */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industries (comma-separated)
                </label>
                <Input
                  placeholder="SaaS, FinTech, E-commerce..."
                  value={formData.experience?.industries?.join(', ') || ''}
                  onChange={(e) =>
                    updateField(
                      'experience.industries',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Availability & Commitment</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Type *</label>
                <select
                  value={formData.availability?.type || 'Full-time'}
                  onChange={(e) => updateField('availability.type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Evenings/Weekends">Evenings/Weekends</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week *</label>
                <Input
                  type="number"
                  value={formData.availability?.hoursPerWeek || 40}
                  onChange={(e) => updateField('availability.hoursPerWeek', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commitment Level *</label>
                <select
                  value={formData.commitment?.level || 'High'}
                  onChange={(e) => updateField('commitment.level', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equity Expectation</label>
                  <Input
                    placeholder="e.g., 20-30%"
                    value={formData.commitment?.equityExpectation || ''}
                    onChange={(e) => updateField('commitment.equityExpectation', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Expectation</label>
                  <Input
                    placeholder="e.g., $5,000 - $8,000"
                    value={formData.commitment?.salaryExpectation || ''}
                    onChange={(e) => updateField('commitment.salaryExpectation', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What You&apos;re Looking For</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.lookingFor?.description || ''}
                  onChange={(e) => updateField('lookingFor.description', e.target.value)}
                  placeholder="Describe what you're looking for in a co-founder and your startup idea..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles Needed (comma-separated)
                </label>
                <Input
                  placeholder="CTO, CMO, Technical Co-founder..."
                  value={formData.lookingFor?.roles?.join(', ') || ''}
                  onChange={(e) =>
                    updateField(
                      'lookingFor.roles',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industries (comma-separated)
                </label>
                <Input
                  placeholder="SaaS, FinTech, Healthcare..."
                  value={formData.lookingFor?.industries?.join(', ') || ''}
                  onChange={(e) =>
                    updateField(
                      'lookingFor.industries',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Stage *</label>
                <select
                  value={formData.lookingFor?.companyStage || 'Idea'}
                  onChange={(e) => updateField('lookingFor.companyStage', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Idea">Idea</option>
                  <option value="MVP">MVP</option>
                  <option value="Early Stage">Early Stage</option>
                  <option value="Growth">Growth</option>
                  <option value="Any">Any</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Values & Preferences</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Core Values (comma-separated)
                </label>
                <Input
                  placeholder="Innovation, Transparency, User-Centric..."
                  value={formData.values?.join(', ') || ''}
                  onChange={(e) =>
                    updateField(
                      'values',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages (format: Language:Proficiency, e.g., English:Native, Mandarin:Fluent)
                </label>
                <Input
                  placeholder="English:Native, Mandarin:Fluent"
                  value={
                    Array.isArray(formData.languages) && formData.languages.length > 0
                      ? formData.languages.map((l) =>
                          typeof l === 'string' ? l : `${(l as { name: string; proficiency: string }).name}:${(l as { name: string; proficiency: string }).proficiency}`
                        ).join(', ')
                      : ''
                  }
                  onChange={(e) => {
                    const languages = e.target.value
                      .split(',')
                      .map((s) => {
                        const [name, proficiency] = s.trim().split(':');
                        return name && proficiency
                          ? { name: name.trim(), proficiency: proficiency.trim() as any }
                          : null;
                      })
                      .filter(Boolean) as any;
                    updateField('languages', languages);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={currentStep === 1 ? onCancel : handlePrevious}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="flex items-center gap-3">
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

