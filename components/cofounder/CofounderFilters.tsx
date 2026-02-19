'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { X, Filter } from 'lucide-react';
import { FilterOptions as CofounderFiltersType, Availability, ExperienceLevel, CommitmentLevel } from '@/types/cofounder';

interface CofounderFiltersProps {
  filters: CofounderFiltersType;
  onFilterChange: (filters: CofounderFiltersType) => void;
}

const LOCATIONS = ['Singapore', 'Remote', 'London', 'San Francisco', 'New York'];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ['beginner', 'intermediate', 'expert'];
const AVAILABILITY_TYPES: Availability[] = ['full-time', 'part-time', 'weekends'];
const COMMITMENT_LEVELS: CommitmentLevel[] = ['high', 'medium', 'low'];
const COMPANY_STAGES = ['Idea', 'MVP', 'Early Stage', 'Growth', 'Any'];

export const CofounderFilters = ({ filters, onFilterChange }: CofounderFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof CofounderFiltersType, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof CofounderFiltersType, value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilter = (key: keyof CofounderFiltersType) => {
    updateFilter(key, undefined);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const activeFiltersCount = Object.values(filters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== '';
  }).length;

  return (
    <Card className="p-4 border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Compatibility Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Compatibility Score
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={filters.minCompatibility || ''}
            onChange={(e) => updateFilter('minCompatibility', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="0-100"
          />
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            {filters.location && filters.location.length > 0 && (
              <button
                onClick={() => clearFilter('location')}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <Badge
                key={loc}
                variant={filters.location?.includes(loc) ? 'primary' : 'default'}
                size="sm"
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('location', loc)}
              >
                {loc}
              </Badge>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
            {filters.experience && filters.experience.length > 0 && (
              <button
                onClick={() => clearFilter('experience')}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <Badge
                key={level}
                variant={filters.experience?.includes(level) ? 'primary' : 'default'}
                size="sm"
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('experience', level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Availability</label>
            {filters.availability && filters.availability.length > 0 && (
              <button
                onClick={() => clearFilter('availability')}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY_TYPES.map((type) => (
              <Badge
                key={type}
                variant={filters.availability?.includes(type) ? 'primary' : 'default'}
                size="sm"
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('availability', type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Commitment Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Commitment Level</label>
            {filters.commitment && filters.commitment.length > 0 && (
              <button
                onClick={() => clearFilter('commitment')}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMITMENT_LEVELS.map((level) => (
              <Badge
                key={level}
                variant={filters.commitment?.includes(level) ? 'primary' : 'default'}
                size="sm"
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('commitment', level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Company Stage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Stage</label>
            {filters.companyStage && filters.companyStage.length > 0 && (
              <button
                onClick={() => clearFilter('companyStage')}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {COMPANY_STAGES.map((stage) => (
              <Badge
                key={stage}
                variant={filters.companyStage?.includes(stage) ? 'primary' : 'default'}
                size="sm"
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('companyStage', stage)}
              >
                {stage}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

