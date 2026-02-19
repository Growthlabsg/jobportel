'use client';

import { useState } from 'react';
import { Application } from '@/types/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';

interface CandidateRatingProps {
  application: Application;
  currentRating?: number;
  onRate: (rating: number) => void;
}

export const CandidateRating = ({
  application,
  currentRating = 0,
  onRate,
}: CandidateRatingProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    onRate(rating);
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Not Rated';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Candidate Rating
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Rate {application.applicant.name} for this position
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      rating <= (hoveredRating || selectedRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">
              {getRatingLabel(selectedRating)}
            </p>
          </div>

          {selectedRating > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your rating helps track candidate quality and improve hiring decisions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

