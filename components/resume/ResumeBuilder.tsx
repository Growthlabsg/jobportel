'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { WorkExperienceStep } from './steps/WorkExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ProjectsStep } from './steps/ProjectsStep';
import { CertificationsStep } from './steps/CertificationsStep';
import { AdditionalStep } from './steps/AdditionalStep';
import { ResumePreview } from './ResumePreview';
import { ResumeData, ResumeStep } from '@/types/resume';
import { updateJobSeekerProfileData, getJobSeekerProfileData } from '@/services/platform/profiles';
import { getActiveJobProfile } from '@/services/platform/auth';

const STEPS: { id: ResumeStep; title: string; description: string }[] = [
  { id: 'personal', title: 'Personal Information', description: 'Your basic details' },
  { id: 'experience', title: 'Work Experience', description: 'Your professional history' },
  { id: 'education', title: 'Education', description: 'Your academic background' },
  { id: 'skills', title: 'Skills', description: 'Your technical and soft skills' },
  { id: 'projects', title: 'Projects', description: 'Notable projects and work' },
  { id: 'certifications', title: 'Certifications', description: 'Professional certifications' },
  { id: 'additional', title: 'Additional', description: 'Languages, awards, publications' },
];

const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  publications: [],
  template: 'modern',
  accentColor: '#0F7377',
  fontSize: 'medium',
};

export const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load resume data from platform and localStorage
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const profile = await getActiveJobProfile();
        if (profile) {
          // Try to load from platform first
          const profileData = await getJobSeekerProfileData(profile.id);
          if (profileData?.resume) {
            try {
              const parsed = JSON.parse(profileData.resume);
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                setResumeData(parsed);
                return;
              }
            } catch (e) {
              // If resume is not JSON, continue to localStorage
            }
          }
        }
        
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const savedDraft = localStorage.getItem('resumeDraft');
          if (savedDraft && savedDraft.trim() !== '') {
            const parsed = JSON.parse(savedDraft);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              setResumeData(parsed);
            } else {
              localStorage.removeItem('resumeDraft');
            }
          }
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
        // Fallback to localStorage on error
        if (typeof window !== 'undefined') {
          try {
            const savedDraft = localStorage.getItem('resumeDraft');
            if (savedDraft && savedDraft.trim() !== '') {
              const parsed = JSON.parse(savedDraft);
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                setResumeData(parsed);
              }
            }
          } catch (e) {
            console.error('Error loading from localStorage:', e);
          }
        }
      }
    };
    
    loadResumeData();
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && resumeData) {
      const timeoutId = setTimeout(() => {
        try {
          // Only save if resumeData is valid and serializable
          const serialized = JSON.stringify(resumeData);
          if (serialized && serialized !== '{}') {
            localStorage.setItem('resumeDraft', serialized);
          }
        } catch (error) {
          console.error('Error saving draft:', error);
        }
      }, 1000); // Debounce auto-save

      return () => clearTimeout(timeoutId);
    }
  }, [resumeData]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const profile = await getActiveJobProfile();
      if (profile) {
        // Convert resume data to profile format
        const profileData = {
          resume: JSON.stringify(resumeData),
          skills: (resumeData.skills || []).map(skill => typeof skill === 'string' ? skill : (skill as any).name || String(skill)),
          experience: resumeData.workExperience.map(exp => ({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
          })),
          education: resumeData.education.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            graduationDate: edu.endDate || edu.startDate,
          })),
          certifications: resumeData.certifications.map(cert => ({
            name: cert.name,
            issuer: cert.issuer || '',
            date: cert.date,
          })),
          portfolio: {
            projects: resumeData.projects.map(proj => ({
              title: proj.name,
              description: proj.description,
              url: proj.url,
            })),
          },
        };
        
        // Sync to platform
        const success = await updateJobSeekerProfileData(profile.id, profileData);
        if (success) {
          // Also save to localStorage as backup
          if (typeof window !== 'undefined') {
            localStorage.setItem('resumeDraft', JSON.stringify(resumeData));
          }
          alert('Resume saved successfully and synced to your profile!');
        } else {
          throw new Error('Failed to sync to platform');
        }
      } else {
        // No active profile, just save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('resumeDraft', JSON.stringify(resumeData));
        }
        alert('Resume saved locally. Please log in to sync to your profile.');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('resumeDraft', JSON.stringify(resumeData));
      }
      alert('Resume saved locally. Failed to sync to platform.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    // This will be implemented with jsPDF or similar
    console.log('Exporting to PDF...');
    alert('PDF export coming soon!');
  };

  const updateResumeData = (updates: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...updates }));
  };

  const currentStepData = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Create a professional resume in minutes with our step-by-step builder
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Main Form Area */}
          <div className={showPreview ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <Card className="p-6">
              {/* Step Navigation */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Step Content */}
              <div className="mb-6">
                {currentStep === 0 && (
                  <PersonalInfoStep
                    data={resumeData.personalInfo}
                    onChange={(data) => updateResumeData({ personalInfo: data })}
                  />
                )}
                {currentStep === 1 && (
                  <WorkExperienceStep
                    data={resumeData.workExperience}
                    onChange={(data: typeof resumeData.workExperience) => updateResumeData({ workExperience: data })}
                  />
                )}
                {currentStep === 2 && (
                  <EducationStep
                    data={resumeData.education}
                    onChange={(data: typeof resumeData.education) => updateResumeData({ education: data })}
                  />
                )}
                {currentStep === 3 && (
                  <SkillsStep
                    data={resumeData.skills}
                    onChange={(data: typeof resumeData.skills) => updateResumeData({ skills: data })}
                  />
                )}
                {currentStep === 4 && (
                  <ProjectsStep
                    data={resumeData.projects}
                    onChange={(data: typeof resumeData.projects) => updateResumeData({ projects: data })}
                  />
                )}
                {currentStep === 5 && (
                  <CertificationsStep
                    data={resumeData.certifications}
                    onChange={(data: typeof resumeData.certifications) => updateResumeData({ certifications: data })}
                  />
                )}
                {currentStep === 6 && (
                  <AdditionalStep
                    languages={resumeData.languages}
                    awards={resumeData.awards}
                    publications={resumeData.publications}
                    onChange={(updates) => updateResumeData(updates)}
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2"
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Preview
                      </>
                    )}
                  </Button>
                  {currentStep === STEPS.length - 1 ? (
                    <Button onClick={handleExportPDF} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export PDF
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="flex items-center gap-2">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Sidebar */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

