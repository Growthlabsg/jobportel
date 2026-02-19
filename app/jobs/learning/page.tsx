'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  BookOpen, 
  Video, 
  Award,
  Clock,
  Users,
  TrendingUp,
  Play,
  ExternalLink,
  CheckCircle2,
  Star,
  Filter,
  Search,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  students: number;
  price: number;
  free: boolean;
  thumbnail?: string;
  skills: string[];
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'tutorial' | 'ebook';
  url: string;
  duration?: string;
  author: string;
  category: string;
  tags: string[];
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Developer Course',
    description: 'Master React from basics to advanced concepts including hooks, context, and performance optimization.',
    instructor: 'John Doe',
    duration: '12 hours',
    level: 'intermediate',
    category: 'Frontend',
    rating: 4.8,
    students: 12500,
    price: 49,
    free: false,
    skills: ['React', 'JavaScript', 'TypeScript', 'Hooks'],
  },
  {
    id: '2',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    instructor: 'Jane Smith',
    duration: '15 hours',
    level: 'intermediate',
    category: 'Backend',
    rating: 4.7,
    students: 8900,
    price: 59,
    free: false,
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
  },
  {
    id: '3',
    title: 'AWS Cloud Fundamentals',
    description: 'Learn AWS services, deployment, and cloud architecture patterns.',
    instructor: 'Mike Johnson',
    duration: '20 hours',
    level: 'advanced',
    category: 'DevOps',
    rating: 4.9,
    students: 15200,
    price: 79,
    free: false,
    skills: ['AWS', 'Cloud Computing', 'DevOps', 'Docker'],
  },
  {
    id: '4',
    title: 'TypeScript for JavaScript Developers',
    description: 'Free course on TypeScript fundamentals and best practices.',
    instructor: 'Sarah Lee',
    duration: '8 hours',
    level: 'beginner',
    category: 'Frontend',
    rating: 4.6,
    students: 21000,
    price: 0,
    free: true,
    skills: ['TypeScript', 'JavaScript'],
  },
];

const mockResources: Resource[] = [
  {
    id: '1',
    title: '10 React Performance Optimization Tips',
    description: 'Learn how to optimize your React applications for better performance.',
    type: 'article',
    url: '#',
    author: 'Tech Blog',
    category: 'Frontend',
    tags: ['React', 'Performance', 'Optimization'],
  },
  {
    id: '2',
    title: 'Building RESTful APIs with Express',
    description: 'Comprehensive guide to building REST APIs using Express.js.',
    type: 'tutorial',
    url: '#',
    duration: '45 min',
    author: 'Dev Tutorials',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'API'],
  },
  {
    id: '3',
    title: 'System Design Interview Prep',
    description: 'Video series on preparing for system design interviews.',
    type: 'video',
    url: '#',
    duration: '2 hours',
    author: 'Interview Prep',
    category: 'Interview',
    tags: ['System Design', 'Interview', 'Architecture'],
  },
];

const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Interview', 'Data Science', 'Mobile'];

function LearningContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredCourses = mockCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesCategory && matchesSearch && matchesLevel;
  });

  const filteredResources = mockResources.filter(resource => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-200'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Learning Resources</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Upskill & Grow
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Access courses, tutorials, and resources to advance your career
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Search and Filters */}
        <Card className="border-2 border-gray-200 mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses and resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-xl border border-gray-200 shadow-sm mb-8">
            <TabsTrigger value="courses" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Courses
            </TabsTrigger>
            <TabsTrigger value="resources" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Free Resources
            </TabsTrigger>
            <TabsTrigger value="paths" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Learning Paths
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-2 border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/50" />
                      {course.free && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          FREE
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          variant="default"
                          className={`${
                            course.level === 'advanced'
                              ? 'bg-red-100 text-red-800'
                              : course.level === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {course.level}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {renderStars(course.rating)}
                          <span className="text-sm font-semibold text-gray-700 ml-1">
                            {course.rating}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{course.students.toLocaleString()} students</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {course.free ? 'Free' : `$${course.price}`}
                          </p>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary-dark">
                          <Play className="h-4 w-4 mr-2" />
                          Enroll
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="border-2 border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${
                        resource.type === 'video' ? 'bg-red-100' :
                        resource.type === 'article' ? 'bg-blue-100' :
                        resource.type === 'tutorial' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {resource.type === 'video' ? (
                          <Video className="h-6 w-6 text-red-600" />
                        ) : resource.type === 'article' ? (
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Award className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Badge variant="default" className="mb-2 bg-gray-100 text-gray-700 dark:text-gray-300">
                          {resource.type}
                        </Badge>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                        {resource.duration && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            <Clock className="h-3 w-3" />
                            <span>{resource.duration}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Resource
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Frontend Developer Path',
                  description: 'Complete path from HTML/CSS to advanced React and Next.js',
                  duration: '3 months',
                  courses: 12,
                  level: 'Beginner to Advanced',
                  skills: ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'TypeScript'],
                },
                {
                  title: 'Full Stack Developer Path',
                  description: 'Master both frontend and backend development',
                  duration: '4 months',
                  courses: 18,
                  level: 'Intermediate',
                  skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
                },
                {
                  title: 'DevOps Engineer Path',
                  description: 'Learn cloud infrastructure, CI/CD, and containerization',
                  duration: '3 months',
                  courses: 10,
                  level: 'Intermediate to Advanced',
                  skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
                },
                {
                  title: 'Data Science Path',
                  description: 'Python, machine learning, and data analysis',
                  duration: '4 months',
                  courses: 15,
                  level: 'Beginner to Advanced',
                  skills: ['Python', 'Pandas', 'Machine Learning', 'SQL', 'Data Visualization'],
                },
              ].map((path, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-primary/30 transition-all">
                  <CardHeader>
                    <CardTitle>{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{path.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Duration</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{path.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Courses</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{path.courses}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Skills You&apos;ll Learn</p>
                      <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill) => (
                          <Badge key={skill} variant="default" className="bg-primary/10 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary-dark">
                      Start Learning Path
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function LearningPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading learning resources...</p>
          </div>
        </div>
      }
    >
      <LearningContent />
    </Suspense>
  );
}

