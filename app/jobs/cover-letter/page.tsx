'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  FileText, 
  Save, 
  Download,
  Eye,
  Edit,
  Sparkles,
  Copy,
  CheckCircle2,
} from 'lucide-react';

interface CoverLetterData {
  recipientName?: string;
  recipientTitle?: string;
  companyName: string;
  jobTitle: string;
  yourName: string;
  yourEmail: string;
  yourPhone?: string;
  introduction: string;
  body: string;
  closing: string;
}

const defaultCoverLetter: CoverLetterData = {
  companyName: '',
  jobTitle: '',
  yourName: '',
  yourEmail: '',
  introduction: '',
  body: '',
  closing: '',
};

function CoverLetterContent() {
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(defaultCoverLetter);
  const [isPreview, setIsPreview] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadDraft();
  }, []);

  const loadDraft = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('coverLetterDraft');
        if (saved && saved.trim() !== '') {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setCoverLetter(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading cover letter draft:', error);
      }
    }
  };

  const saveDraft = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('coverLetterDraft', JSON.stringify(coverLetter));
        alert('Cover letter saved!');
      } catch (error) {
        console.error('Error saving cover letter:', error);
      }
    }
  };

  const generateCoverLetter = () => {
    // AI-powered generation would go here
    const generated = {
      ...coverLetter,
      introduction: `I am writing to express my strong interest in the ${coverLetter.jobTitle} position at ${coverLetter.companyName}. With my background in [your field], I am excited about the opportunity to contribute to your team.`,
      body: `In my previous role, I have developed strong skills in [relevant skills] that align perfectly with the requirements of this position. I am particularly drawn to ${coverLetter.companyName}'s commitment to [company value/mission], and I am eager to bring my expertise to help achieve your goals.`,
      closing: `Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experience can contribute to ${coverLetter.companyName}'s continued success.`,
    };
    setCoverLetter(generated);
  };

  const copyToClipboard = () => {
    const fullLetter = formatCoverLetter();
    navigator.clipboard.writeText(fullLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCoverLetter = () => {
    return `${coverLetter.yourName}
${coverLetter.yourEmail}${coverLetter.yourPhone ? `\n${coverLetter.yourPhone}` : ''}

${coverLetter.recipientName ? `${coverLetter.recipientName}\n` : ''}${coverLetter.recipientTitle ? `${coverLetter.recipientTitle}\n` : ''}${coverLetter.companyName}

Dear ${coverLetter.recipientName || 'Hiring Manager'},

${coverLetter.introduction}

${coverLetter.body}

${coverLetter.closing}

Sincerely,
${coverLetter.yourName}`;
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Cover Letter Builder</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Create Your Cover Letter
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Craft a professional cover letter that stands out to employers
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              <Button
                variant={!isPreview ? 'primary' : 'outline'}
                onClick={() => setIsPreview(false)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant={isPreview ? 'primary' : 'outline'}
                onClick={() => setIsPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={generateCoverLetter}>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Generate
              </Button>
              <Button variant="outline" onClick={copyToClipboard}>
                {copied ? (
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
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {!isPreview ? (
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 md:p-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                      <Input
                        value={coverLetter.yourName}
                        onChange={(e) => setCoverLetter({ ...coverLetter, yourName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email *</label>
                      <Input
                        type="email"
                        value={coverLetter.yourEmail}
                        onChange={(e) => setCoverLetter({ ...coverLetter, yourEmail: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Phone</label>
                    <Input
                      value={coverLetter.yourPhone || ''}
                      onChange={(e) => setCoverLetter({ ...coverLetter, yourPhone: e.target.value })}
                      placeholder="+65 1234 5678"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                      <Input
                        value={coverLetter.companyName}
                        onChange={(e) => setCoverLetter({ ...coverLetter, companyName: e.target.value })}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                      <Input
                        value={coverLetter.jobTitle}
                        onChange={(e) => setCoverLetter({ ...coverLetter, jobTitle: e.target.value })}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Name</label>
                      <Input
                        value={coverLetter.recipientName || ''}
                        onChange={(e) => setCoverLetter({ ...coverLetter, recipientName: e.target.value })}
                        placeholder="Hiring Manager"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Title</label>
                      <Input
                        value={coverLetter.recipientTitle || ''}
                        onChange={(e) => setCoverLetter({ ...coverLetter, recipientTitle: e.target.value })}
                        placeholder="HR Manager"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Introduction *</label>
                    <Textarea
                      value={coverLetter.introduction}
                      onChange={(e) => setCoverLetter({ ...coverLetter, introduction: e.target.value })}
                      placeholder="Express your interest and mention the position..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Body *</label>
                    <Textarea
                      value={coverLetter.body}
                      onChange={(e) => setCoverLetter({ ...coverLetter, body: e.target.value })}
                      placeholder="Highlight your relevant experience and skills..."
                      rows={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Closing *</label>
                    <Textarea
                      value={coverLetter.closing}
                      onChange={(e) => setCoverLetter({ ...coverLetter, closing: e.target.value })}
                      placeholder="Thank the reader and express interest in next steps..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 md:p-8">
                <div className="prose max-w-none">
                  <div className="text-right mb-8">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{coverLetter.yourName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{coverLetter.yourEmail}</p>
                    {coverLetter.yourPhone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{coverLetter.yourPhone}</p>
                    )}
                  </div>
                  <div className="mb-8">
                    {coverLetter.recipientName && (
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{coverLetter.recipientName}</p>
                    )}
                    {coverLetter.recipientTitle && (
                      <p className="text-gray-600 dark:text-gray-400">{coverLetter.recipientTitle}</p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">{coverLetter.companyName}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700 mb-4">
                      Dear {coverLetter.recipientName || 'Hiring Manager'},
                    </p>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{coverLetter.introduction}</p>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{coverLetter.body}</p>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{coverLetter.closing}</p>
                    <p className="text-gray-700 mb-4">Sincerely,</p>
                    <p className="text-gray-900 font-semibold">{coverLetter.yourName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function CoverLetterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading cover letter builder...</p>
          </div>
        </div>
      }
    >
      <CoverLetterContent />
    </Suspense>
  );
}

