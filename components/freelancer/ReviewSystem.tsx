'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Review } from '@/types/freelancer';

interface ReviewSystemProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  canReview?: boolean;
  onSubmitReview?: (review: any) => void;
}

export function ReviewSystem({ 
  reviews, 
  averageRating, 
  totalReviews,
  canReview = false,
  onSubmitReview,
}: ReviewSystemProps) {
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                      {review.reviewerType === 'client' ? 'C' : 'F'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {review.reviewerType === 'client' ? 'Client' : 'Freelancer'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                )}
                {review.categories && Object.keys(review.categories).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {Object.entries(review.categories).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {value}/5
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center text-gray-600 dark:text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>No reviews yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

