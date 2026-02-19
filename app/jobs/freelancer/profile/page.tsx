'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFreelancerProfile, useSaveFreelancerProfile } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { User, DollarSign, MapPin, Plus, X, Save } from 'lucide-react';
import { CreateFreelancerProfileData, ExperienceLevel } from '@/types/freelancer';

const profileSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  hourlyRate: z.number().optional(),
  availability: z.enum(['full-time', 'part-time', 'as-needed']),
  experienceLevel: z.enum(['entry', 'intermediate', 'expert']),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  location: z.string().optional(),
  timezone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const popularSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'UI/UX', 'Figma',
  'Graphic Design', 'Content Writing', 'SEO', 'Social Media', 'Data Analysis',
  'Vue.js', 'Angular', 'Next.js', 'Express', 'MongoDB', 'PostgreSQL',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
];

export default function FreelancerProfilePage() {
  const router = useRouter();
  const { data: existingProfile, isLoading } = useFreelancerProfile();
  const saveProfile = useSaveFreelancerProfile();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      availability: 'as-needed',
      experienceLevel: 'intermediate',
    },
  });

  useEffect(() => {
    if (existingProfile) {
      reset({
        title: existingProfile.title,
        description: existingProfile.description,
        hourlyRate: existingProfile.hourlyRate,
        availability: existingProfile.availability,
        experienceLevel: existingProfile.experienceLevel,
        location: existingProfile.location,
        timezone: existingProfile.timezone,
      });
      setSkills(existingProfile.skills);
    }
  }, [existingProfile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const profileData: CreateFreelancerProfileData = {
      title: data.title,
      description: data.description,
      hourlyRate: data.hourlyRate,
      availability: data.availability,
      experienceLevel: data.experienceLevel,
      skills: skills,
      location: data.location,
      timezone: data.timezone,
    };

    try {
      const result = await saveProfile.mutateAsync(profileData);
      if (result) {
        router.push(`/jobs/freelancer/freelancers/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
      setValue('skills', [...skills, skill] as any);
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter(s => s !== skill);
    setSkills(newSkills);
    setValue('skills', newSkills as any);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {existingProfile ? 'Edit Freelancer Profile' : 'Create Freelancer Profile'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Build your freelancer profile to start getting projects
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-2 border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Input
                  label="Professional Title"
                  placeholder="e.g., Full Stack Developer, UI/UX Designer"
                  {...register('title')}
                  error={errors.title?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <Textarea
                  placeholder="Tell clients about yourself, your experience, and what you can do for them..."
                  rows={8}
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    {...register('experienceLevel')}
                  >
                    <option value="entry">Entry Level</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    {...register('availability')}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="as-needed">As-needed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills *
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
              <CardTitle>Rates & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Input
                  type="number"
                  label="Hourly Rate (USD)"
                  placeholder="e.g., 50"
                  {...register('hourlyRate', { valueAsNumber: true })}
                  error={errors.hourlyRate?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Location (Optional)"
                    placeholder="e.g., San Francisco, USA"
                    {...register('location')}
                    error={errors.location?.message}
                  />
                </div>
                <div>
                  <Input
                    label="Timezone (Optional)"
                    placeholder="e.g., GMT+8"
                    {...register('timezone')}
                    error={errors.timezone?.message}
                  />
                </div>
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
              isLoading={saveProfile.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {existingProfile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

