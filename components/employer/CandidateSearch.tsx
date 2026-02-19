'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Briefcase, 
  Star,
  Mail,
  Phone,
  Linkedin,
  Github,
  CheckCircle2,
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  skills: string[];
  matchScore: number;
  avatar?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  verified: boolean;
  available: boolean;
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  portfolio?: string;
}

interface CandidateSearchProps {
  companyId?: string;
}

export function CandidateSearch({ companyId }: CandidateSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Mock candidates
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior Full Stack Developer',
      location: 'Singapore',
      experience: '5 years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
      matchScore: 95,
      verified: true,
      available: true,
      salaryExpectation: {
        min: 10000,
        max: 15000,
        currency: 'USD',
      },
      linkedin: 'linkedin.com/in/sarahchen',
      github: 'github.com/sarahchen',
    },
    {
      id: '2',
      name: 'Michael Tan',
      title: 'Product Manager',
      location: 'Singapore',
      experience: '7 years',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'B2B'],
      matchScore: 88,
      verified: true,
      available: true,
      salaryExpectation: {
        min: 12000,
        max: 18000,
        currency: 'USD',
      },
    },
    {
      id: '3',
      name: 'Emily Wong',
      title: 'UI/UX Designer',
      location: 'Remote',
      experience: '4 years',
      skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
      matchScore: 92,
      verified: true,
      available: false,
    },
  ];

  const displayCandidates = candidates.length > 0 ? candidates : mockCandidates;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Candidate Search</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find and connect with top talent</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search by name, skills, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {displayCandidates.map((candidate) => (
            <Card key={candidate.id} className="p-6 border-2 border-gray-200 hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4">
                {candidate.avatar ? (
                  <img 
                    src={candidate.avatar} 
                    alt={candidate.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">{candidate.name}</h4>
                        {candidate.verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        )}
                        {candidate.available && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Available
                          </Badge>
                        )}
                        {!candidate.available && (
                        <Badge variant="default">
                          Not Available
                        </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{candidate.title}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{candidate.experience}</span>
                        </div>
                        {candidate.salaryExpectation && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>
                              {candidate.salaryExpectation.currency} {candidate.salaryExpectation.min.toLocaleString()} - {candidate.salaryExpectation.max.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">{candidate.matchScore}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Match</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.map((skill, idx) => (
                      <Badge key={idx} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {candidate.email && (
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    )}
                    {candidate.linkedin && (
                      <Button size="sm" variant="outline">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                    {candidate.github && (
                      <Button size="sm" variant="outline">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    )}
                    {candidate.portfolio && (
                      <Button size="sm" variant="outline">
                        View Portfolio
                      </Button>
                    )}
                    <Button size="sm" className="ml-auto">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">
            Load More Candidates
          </Button>
        </div>
      </Card>
    </div>
  );
}

