'use client';

import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skill } from '@/types/resume';

interface SkillsStepProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export const SkillsStep = ({ data, onChange }: SkillsStepProps) => {
  const addSkill = (category: 'technical' | 'soft' | 'language' = 'technical') => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category,
      level: category === 'language' ? 'fluent' : 'intermediate',
    };
    onChange([...data, newSkill]);
  };

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id));
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    onChange(data.map((skill) => (skill.id === id ? { ...skill, ...updates } : skill)));
  };

  const technicalSkills = data.filter((s) => s.category === 'technical');
  const softSkills = data.filter((s) => s.category === 'soft');
  const languages = data.filter((s) => s.category === 'language');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-4">Add your skills and expertise by category</p>
      </div>

      <div className="space-y-6">
        {/* Technical Skills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Technical Skills</h3>
            <Button onClick={() => addSkill('technical')} size="sm" variant="outline" className="flex items-center gap-1">
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
          {technicalSkills.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No technical skills added</p>
          ) : (
            <div className="space-y-2">
              {technicalSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="e.g., React, Python, AWS"
                    className="flex-1"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, { level: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Soft Skills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Soft Skills</h3>
            <Button onClick={() => addSkill('soft')} size="sm" variant="outline" className="flex items-center gap-1">
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
          {softSkills.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No soft skills added</p>
          ) : (
            <div className="space-y-2">
              {softSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="e.g., Leadership, Communication"
                    className="flex-1"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, { level: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Languages</h3>
            <Button onClick={() => addSkill('language')} size="sm" variant="outline" className="flex items-center gap-1">
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
          {languages.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No languages added</p>
          ) : (
            <div className="space-y-2">
              {languages.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="e.g., English, Mandarin"
                    className="flex-1"
                  />
                  <select
                    value={skill.level || 'fluent'}
                    onChange={(e) => {
                      const value = e.target.value as 'basic' | 'conversational' | 'fluent' | 'native';
                      updateSkill(skill.id, { level: value });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="basic">Basic</option>
                    <option value="conversational">Conversational</option>
                    <option value="fluent">Fluent</option>
                    <option value="native">Native</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

