'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  FileText, 
  Download,
  Copy,
  CheckCircle2,
  Search,
  Filter,
  Star,
  Eye,
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'resume' | 'cover-letter' | 'email' | 'follow-up' | 'thank-you';
  format: 'docx' | 'pdf' | 'txt';
  downloads: number;
  rating: number;
  preview?: string;
  tags: string[];
}

// Mock templates
const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Software Engineer Resume Template',
    description: 'Modern, ATS-friendly resume template for software engineers',
    category: 'resume',
    format: 'docx',
    downloads: 1250,
    rating: 4.8,
    tags: ['Technical', 'ATS-Friendly', 'Modern'],
  },
  {
    id: '2',
    title: 'Product Manager Cover Letter',
    description: 'Professional cover letter template for product management roles',
    category: 'cover-letter',
    format: 'docx',
    downloads: 890,
    rating: 4.7,
    tags: ['Product', 'Professional'],
  },
  {
    id: '3',
    title: 'Thank You Email Template',
    description: 'Post-interview thank you email template',
    category: 'thank-you',
    format: 'txt',
    downloads: 2100,
    rating: 4.9,
    tags: ['Interview', 'Follow-up'],
  },
  {
    id: '4',
    title: 'Application Follow-up Email',
    description: 'Professional follow-up email after submitting application',
    category: 'follow-up',
    format: 'txt',
    downloads: 1560,
    rating: 4.6,
    tags: ['Application', 'Professional'],
  },
  {
    id: '5',
    title: 'Designer Portfolio Resume',
    description: 'Creative resume template for designers and creatives',
    category: 'resume',
    format: 'pdf',
    downloads: 980,
    rating: 4.5,
    tags: ['Creative', 'Design', 'Portfolio'],
  },
];

function ApplicationTemplatesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (templateId: string) => {
    setCopiedId(templateId);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
              <FileText className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Application Templates</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Professional Templates
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Download professionally designed templates for resumes, cover letters, and emails
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
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="all">All Categories</option>
                <option value="resume">Resume</option>
                <option value="cover-letter">Cover Letter</option>
                <option value="email">Email</option>
                <option value="follow-up">Follow-up</option>
                <option value="thank-you">Thank You</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card className="border-2 border-gray-200 text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Templates Found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="border-2 border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="default"
                          className={`${
                            template.category === 'resume'
                              ? 'bg-blue-100 text-blue-800'
                              : template.category === 'cover-letter'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {template.category.replace('-', ' ')}
                        </Badge>
                        <Badge variant="default" className="bg-gray-100 text-gray-700 dark:text-gray-300">
                          {template.format.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{template.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {renderStars(template.rating)}
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{template.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {template.downloads.toLocaleString()} downloads
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCopy(template.id)}
                    >
                      {copiedId === template.id ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary-dark">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function ApplicationTemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading templates...</p>
          </div>
        </div>
      }
    >
      <ApplicationTemplatesContent />
    </Suspense>
  );
}

