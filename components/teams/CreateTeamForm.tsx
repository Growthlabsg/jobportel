'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { X, Plus } from 'lucide-react';

interface CreateTeamFormData {
  name: string;
  description: string;
  projectGoals: string;
  industry: string;
  stage: 'idea' | 'mvp' | 'early' | 'growth';
  requiredSkills: string[];
  tags: string[];
  location: string;
  remoteWork: 'on-site' | 'remote' | 'hybrid';
  commitmentLevel: 'part-time' | 'full-time' | 'flexible';
  equityOffered: string;
}

export function CreateTeamForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTeamFormData>({
    name: '',
    description: '',
    projectGoals: '',
    industry: '',
    stage: 'idea',
    requiredSkills: [],
    tags: [],
    location: '',
    remoteWork: 'hybrid',
    commitmentLevel: 'full-time',
    equityOffered: '',
  });

  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate slug from name
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // In a real app, this would create the team via API
    console.log('Creating team:', { ...formData, slug });

    setIsSubmitting(false);
    alert('Team created successfully!');
    router.push(`/jobs/build-teams/${slug}`);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name && formData.description && formData.projectGoals && formData.industry;
    }
    if (currentStep === 2) {
      return formData.requiredSkills.length > 0 && formData.location;
    }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Team</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Step {currentStep} of 3
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Team/Project Name *"
                  placeholder="e.g., EcoTrack, LearnFlow"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your project in a few sentences..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Goals *
                  </label>
                  <textarea
                    placeholder="What are your key objectives and milestones?"
                    value={formData.projectGoals}
                    onChange={(e) => setFormData({ ...formData, projectGoals: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="Climate Tech">Climate Tech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="FinTech">FinTech</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="SaaS">SaaS</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stage *
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stage: e.target.value as CreateTeamFormData['stage'],
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="idea">Idea</option>
                      <option value="mvp">MVP</option>
                      <option value="early">Early</option>
                      <option value="growth">Growth</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills & Requirements */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Required Skills *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a skill (e.g., React, Python, Design)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="primary" size="md" className="flex items-center gap-1">
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add tags (e.g., saas, mobile, ai)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="info" size="sm" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Location *"
                    placeholder="e.g., Singapore, Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Work Type *
                    </label>
                    <select
                      value={formData.remoteWork}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          remoteWork: e.target.value as CreateTeamFormData['remoteWork'],
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on-site">On-site</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Commitment Level *
                    </label>
                    <select
                      value={formData.commitmentLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commitmentLevel: e.target.value as CreateTeamFormData['commitmentLevel'],
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="part-time">Part-time</option>
                      <option value="full-time">Full-time</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <Input
                    label="Equity Offered (optional)"
                    placeholder="e.g., 5-10%"
                    value={formData.equityOffered}
                    onChange={(e) => setFormData({ ...formData, equityOffered: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Review Your Team
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{formData.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Industry:
                      </span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{formData.industry}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Stage:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {formData.stage}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Location:
                      </span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{formData.location}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Skills:
                      </span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">
                        {formData.requiredSkills.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Create Team
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

