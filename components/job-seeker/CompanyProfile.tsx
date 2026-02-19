'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Building, 
  Star, 
  MapPin, 
  Users, 
  TrendingUp, 
  Globe, 
  CheckCircle2,
  MessageSquare,
  Bookmark,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { Company, CompanyReview } from '@/types/company';

interface CompanyProfileProps {
  company: Company;
  reviews?: CompanyReview[];
}

export function CompanyProfile({ company, reviews = [] }: CompanyProfileProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const rating = company.rating || {
    overall: 4.2,
    culture: 4.0,
    compensation: 4.3,
    workLifeBalance: 3.8,
    careerGrowth: 4.1,
    management: 4.0,
    totalReviews: 0,
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <Building className="h-10 w-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{company.name}</h1>
                {company.verified && (
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                )}
                {company.featured && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-3">{company.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{company.headquarters || 'Singapore'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{company.size}</span>
                </div>
                {company.founded && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    <span>Founded {company.founded}</span>
                  </div>
                )}
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Follow
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Rating Summary */}
        {rating.totalReviews > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {rating.overall.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(rating.overall)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{rating.totalReviews} reviews</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">Culture</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{rating.culture.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">Compensation</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{rating.compensation.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">Work-Life</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{rating.workLifeBalance.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">Growth</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{rating.careerGrowth.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">Management</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{rating.management.toFixed(1)}</div>
            </div>
          </div>
        )}
      </Card>

      {/* Company Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">About</h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-medium">Industry:</span> {company.industry}
            </div>
            <div>
              <span className="font-medium">Size:</span> {company.size}
            </div>
            {company.fundingStage && (
              <div>
                <span className="font-medium">Funding Stage:</span> {company.fundingStage}
              </div>
            )}
            {company.founded && (
              <div>
                <span className="font-medium">Founded:</span> {company.founded}
              </div>
            )}
            {company.locations.length > 0 && (
              <div>
                <span className="font-medium">Locations:</span>{' '}
                {company.locations.join(', ')}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Benefits & Culture</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Benefits:</div>
              <div className="flex flex-wrap gap-2">
                {company.benefits.map((benefit, idx) => (
                  <Badge key={idx} variant="default" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
            {company.values.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Values:</div>
                <div className="flex flex-wrap gap-2">
                  {company.values.map((value, idx) => (
                    <Badge key={idx} className="text-xs bg-primary/10 text-primary border-primary/20">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm">
              {company.remoteFriendly && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Remote Friendly
                </Badge>
              )}
              {company.visaSponsorship && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  Visa Sponsorship
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Reviews ({reviews.length})
            </h3>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Write Review
            </Button>
          </div>
          <div className="space-y-4">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {review.userAvatar ? (
                      <img 
                        src={review.userAvatar} 
                        alt={review.userName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{review.userName}</div>
                      {review.userRole && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {review.userRole} {review.employmentStatus === 'Current' ? '• Current' : '• Former'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating.overall
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{review.title}</h4>
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  {review.pros.length > 0 && (
                    <div>
                      <div className="font-medium text-green-700 mb-1">Pros</div>
                      <ul className="space-y-1">
                        {review.pros.map((pro, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <div className="font-medium text-red-700 mb-1">Cons</div>
                      <ul className="space-y-1">
                        {review.cons.map((con, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {review.advice && (
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Advice to Management:</span> {review.advice}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <span>Helpful ({review.helpful})</span>
                    {review.recommendation === 'Yes' && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Recommends
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {reviews.length > 3 && (
              <Button
                variant="outline"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full"
              >
                {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

