'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Github,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Award,
  Code,
  FileText,
  Save,
  Download,
  Palette,
  Eye,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  website?: string;
  github?: string;
  linkedin?: string;
  projects: Project[];
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

const defaultPortfolio: PortfolioData = {
  name: '',
  title: '',
  bio: '',
  location: '',
  email: '',
  projects: [],
  skills: [],
  certifications: [],
};

type PortfolioTheme = 'modern' | 'classic' | 'minimal' | 'creative';

function PortfolioContent() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolio);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<PortfolioTheme>('modern');
  const [isPreview, setIsPreview] = useState(false);

  const loadPortfolio = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio');
        if (saved && saved.trim() !== '') {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setPortfolio(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
      }
    }
  };

  const savePortfolio = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        alert('Portfolio saved successfully!');
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving portfolio:', error);
        alert('Failed to save portfolio');
      }
    }
  };

  const handleAddProject = (project: Project) => {
    setPortfolio({
      ...portfolio,
      projects: [...portfolio.projects, { ...project, id: Date.now().toString() }],
    });
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      ),
    });
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setPortfolio({
        ...portfolio,
        projects: portfolio.projects.filter((p) => p.id !== projectId),
      });
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Portfolio Showcase</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Build Your Portfolio
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Showcase your projects, skills, and achievements to potential employers
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {!isEditing ? (
          <>
            {/* View Mode */}
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-gray-200 mb-6">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {portfolio.name || 'Your Name'}
                      </h2>
                      <p className="text-xl text-gray-600 mb-4">
                        {portfolio.title || 'Your Title'}
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {portfolio.bio || 'Add a bio to introduce yourself...'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {portfolio.location && (
                          <span>{portfolio.location}</span>
                        )}
                        {portfolio.email && (
                          <span>{portfolio.email}</span>
                        )}
                      </div>
                      <div className="flex gap-3 mt-4">
                        {portfolio.github && (
                          <a
                            href={portfolio.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </a>
                        )}
                        {portfolio.website && (
                          <a
                            href={portfolio.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setIsPreview(!isPreview)} variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        {isPreview ? 'Edit' : 'Preview'}
                      </Button>
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button onClick={() => alert('PDF export coming soon!')} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Selector */}
              <Card className="border-2 border-gray-200 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Portfolio Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['modern', 'classic', 'minimal', 'creative'] as PortfolioTheme[]).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedTheme === theme
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize mb-2">{theme}</div>
                        <div className={`h-16 rounded ${
                          theme === 'modern' ? 'bg-gradient-to-br from-primary to-primary-dark' :
                          theme === 'classic' ? 'bg-gradient-to-br from-gray-700 to-gray-900' :
                          theme === 'minimal' ? 'bg-white border-2 border-gray-300' :
                          'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`} />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              {portfolio.skills.length > 0 && (
                <Card className="border-2 border-gray-200 mb-6">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills.map((skill) => (
                        <Badge key={skill} variant="default" className="bg-primary/10 text-primary border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
                <Button onClick={() => {
                  setEditingProject(null);
                  setShowProjectForm(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {portfolio.projects.length === 0 ? (
                <Card className="border-2 border-gray-200 text-center py-12">
                  <CardContent>
                    <Code className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Projects Yet</h3>
                    <p className="text-gray-600 mb-6">Add your first project to showcase your work</p>
                    <Button onClick={() => {
                      setEditingProject(null);
                      setShowProjectForm(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.projects.map((project) => (
                    <Card key={project.id} className="border-2 border-gray-200 hover:border-primary/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{project.title}</h3>
                              {project.featured && (
                                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="default" className="bg-gray-100 text-gray-700 border-gray-200 dark:border-gray-700">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                              <Github className="h-4 w-4" />
                              Code
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Live Demo
                            </a>
                          )}
                          <div className="flex-1" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProject(project);
                              setShowProjectForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {portfolio.certifications.length > 0 && (
                <Card className="border-2 border-gray-200 mt-6">
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolio.certifications.map((cert) => (
                        <div key={cert.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <Award className="h-6 w-6 text-primary mt-1" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{cert.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{cert.date}</p>
                          </div>
                          {cert.url && (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-gray-200 mb-6">
                <CardHeader>
                  <CardTitle>Edit Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <Input
                      value={portfolio.name}
                      onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <Input
                      value={portfolio.title}
                      onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                    <Textarea
                      value={portfolio.bio}
                      onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <Input
                        value={portfolio.location}
                        onChange={(e) => setPortfolio({ ...portfolio, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={portfolio.email}
                        onChange={(e) => setPortfolio({ ...portfolio, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
                      <Input
                        value={portfolio.github || ''}
                        onChange={(e) => setPortfolio({ ...portfolio, github: e.target.value })}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                      <Input
                        value={portfolio.website || ''}
                        onChange={(e) => setPortfolio({ ...portfolio, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={savePortfolio} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Project Form Modal */}
        {showProjectForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="border-2 border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectForm
                  project={editingProject}
                  onSave={editingProject ? handleUpdateProject : handleAddProject}
                  onCancel={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: project?.title || '',
    description: project?.description || '',
    technologies: project?.technologies || [],
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    imageUrl: project?.imageUrl || '',
    featured: project?.featured || false,
  });
  const [newTech, setNewTech] = useState('');

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()],
      });
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: project?.id || Date.now().toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder="Add technology"
          />
          <Button type="button" onClick={handleAddTech} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech) => (
            <Badge key={tech} variant="default" className="bg-primary/10 text-primary border-primary/20">
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTech(tech)}
                className="ml-2 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
          <Input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Live URL</label>
          <Input
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="featured" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Featured Project
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {project ? 'Update' : 'Add'} Project
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export const dynamic = 'force-dynamic';

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading portfolio...</p>
          </div>
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}

