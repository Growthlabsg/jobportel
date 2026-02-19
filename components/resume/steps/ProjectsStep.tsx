'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Project } from '@/types/resume';

interface ProjectsStepProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export const ProjectsStep = ({ data, onChange }: ProjectsStepProps) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      githubUrl: '',
    };
    onChange([...data, newProject]);
  };

  const removeProject = (id: string) => {
    onChange(data.filter((project) => project.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(data.map((project) => (project.id === id ? { ...project, ...updates } : project)));
  };

  const addTechnology = (id: string) => {
    const project = data.find((p) => p.id === id);
    if (project) {
      updateProject(id, { technologies: [...(project.technologies || []), ''] });
    }
  };

  const updateTechnology = (id: string, index: number, value: string) => {
    const project = data.find((p) => p.id === id);
    if (project) {
      const technologies = [...(project.technologies || [])];
      technologies[index] = value;
      updateProject(id, { technologies });
    }
  };

  const removeTechnology = (id: string, index: number) => {
    const project = data.find((p) => p.id === id);
    if (project) {
      const technologies = project.technologies?.filter((_, i) => i !== index) || [];
      updateProject(id, { technologies });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">Showcase your projects and portfolio work</p>
        <Button onClick={addProject} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No projects added yet</p>
          <Button onClick={addProject} variant="outline">
            Add Your First Project
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {data.map((project, index) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Project #{index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  placeholder="E-commerce Platform"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  placeholder="Describe the project, your role, and key achievements..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project URL
                  </label>
                  <Input
                    type="url"
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                    placeholder="https://project-demo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <Input
                    type="url"
                    value={project.githubUrl || ''}
                    onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Technologies Used
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addTechnology(project.id)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Add Technology
                  </Button>
                </div>
                <div className="space-y-2">
                  {project.technologies?.map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={tech}
                        onChange={(e) => updateTechnology(project.id, idx, e.target.value)}
                        placeholder="e.g., React, Node.js, MongoDB"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechnology(project.id, idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

