'use client';

import { useState, useEffect } from 'react';
import { useFreelancerProfile } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  User, 
  Star, 
  DollarSign, 
  MapPin, 
  Clock,
  CheckCircle2,
  Briefcase,
  Award,
  GraduationCap,
  Globe,
  ArrowLeft,
  MessageSquare,
  FileText,
  Share2,
  Heart,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PaymentProtectionBadge, VerificationBadge, JobSuccessScoreBadge } from '@/components/freelancer/PaymentProtectionBadge';
import { ConnectsDisplay } from '@/components/freelancer/ConnectsDisplay';
import { ReviewSystem } from '@/components/freelancer/ReviewSystem';
import { XPLevelDisplay } from '@/components/freelancer/XPLevelDisplay';
import { MembershipBadge } from '@/components/freelancer/MembershipBadge';

export default function FreelancerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const freelancerId = params?.id as string;
  const { data: freelancer, isLoading } = useFreelancerProfile(freelancerId);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('saved_freelancers');
    if (saved && freelancerId) {
      const savedArray = JSON.parse(saved);
      setIsSaved(savedArray.includes(freelancerId));
    }
  }, [freelancerId]);

  const toggleSave = () => {
    const saved = localStorage.getItem('saved_freelancers');
    const savedArray = saved ? JSON.parse(saved) : [];
    if (isSaved) {
      const newArray = savedArray.filter((id: string) => id !== freelancerId);
      localStorage.setItem('saved_freelancers', JSON.stringify(newArray));
      setIsSaved(false);
    } else {
      savedArray.push(freelancerId);
      localStorage.setItem('saved_freelancers', JSON.stringify(savedArray));
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${freelancer?.title} - Freelancer Profile`,
        text: `Check out ${freelancer?.title}'s profile on Growth Lab`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading freelancer profile...</p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Freelancer Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The freelancer profile you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/jobs/freelancer/find">
            <Button>Browse Freelancers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <Link href="/jobs/freelancer/find">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Freelancers
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    {freelancer.title.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {freelancer.title}
                      </h1>
                      <VerificationBadge 
                        verified={freelancer.verified} 
                        identityVerified={freelancer.identityVerified}
                      />
                      {freelancer.jobSuccessScore && (
                        <JobSuccessScoreBadge score={freelancer.jobSuccessScore} />
                      )}
                      <MembershipBadge tier={freelancer.membershipTier || 'basic'} variant="compact" />
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={toggleSave}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title={isSaved ? 'Remove from saved' : 'Save freelancer'}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              isSaved
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          />
                        </button>
                        <button
                          onClick={handleShare}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Share profile"
                        >
                          <Share2 className="w-5 h-5 text-gray-400 hover:text-primary" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {freelancer.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{freelancer.location}</span>
                        </div>
                      )}
                      {freelancer.timezone && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{freelancer.timezone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{freelancer.rating.toFixed(1)}</span>
                        <span>({freelancer.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {freelancer.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            {freelancer.portfolio && freelancer.portfolio.length > 0 && (
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Portfolio ({freelancer.portfolio.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {freelancer.portfolio.map((item) => (
                      <div key={item.id} className="group border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-dark"
                              title="View project"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                        {item.skills && item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {item.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        {item.completedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Completed {new Date(item.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {freelancer.education && freelancer.education.length > 0 && (
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {freelancer.education.map((edu) => (
                      <div key={edu.id} className="flex items-start gap-4">
                        <GraduationCap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{edu.degree}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {freelancer.certifications && freelancer.certifications.length > 0 && (
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {freelancer.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-4">
                        <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{cert.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Issued {cert.issueDate}
                            {cert.expiryDate && ` • Expires ${cert.expiryDate}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-700 sticky top-4">
              <CardContent className="p-6">
                {freelancer.hourlyRate && (
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-1">
                      ${freelancer.hourlyRate}/hr
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Hourly Rate</div>
                  </div>
                )}

                <Link href={`/jobs/freelancer/post-project`} className="block mb-4">
                  <Button className="w-full">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Hire for Project
                  </Button>
                </Link>
                <Button variant="outline" className="w-full mb-4">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Freelancer
                </Button>

                {/* Membership & XP Display */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Membership</span>
                    <MembershipBadge tier={freelancer.membershipTier || 'basic'} variant="compact" />
                  </div>
                  {(freelancer.xp !== undefined || freelancer.level !== undefined) && (
                    <XPLevelDisplay 
                      xp={freelancer.xp || 0} 
                      level={freelancer.level || 1} 
                      variant="compact" 
                    />
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Availability</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {freelancer.availability.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Experience</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {freelancer.experienceLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Jobs Completed</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{freelancer.totalJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{freelancer.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Earned</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${freelancer.totalEarnings.toLocaleString()}
                    </span>
                  </div>
                  {freelancer.responseTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{freelancer.responseTime}</span>
                    </div>
                  )}
                </div>

                {freelancer.languages && freelancer.languages.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Languages</h4>
                    <div className="space-y-2">
                      {freelancer.languages.map((lang, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{lang.language}</span>
                          <span className="text-gray-900 dark:text-gray-100 capitalize">{lang.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

