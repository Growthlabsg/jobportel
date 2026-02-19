'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { FilterOptions, ExperienceLevel, Availability, CommitmentLevel } from '@/types/cofounder';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface EnhancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose?: () => void;
}

const experienceLevels: ExperienceLevel[] = ['beginner', 'intermediate', 'expert'];
const availabilityOptions: Availability[] = ['full-time', 'part-time', 'weekends'];
const commitmentLevels: CommitmentLevel[] = ['high', 'medium', 'low'];

const commonSkills = [
  'Product Management',
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Data Science',
  'Machine Learning',
  'Business Development',
  'Finance',
  'Operations',
];

const commonValues = [
  'Innovation',
  'Impact',
  'Growth',
  'Quality',
  'Transparency',
  'Collaboration',
  'Sustainability',
  'Diversity',
];

const commonIndustries = [
  'AI',
  'Fintech',
  'Healthcare',
  'SaaS',
  'E-commerce',
  'EdTech',
  'Blockchain',
  'Biotech',
];

export function EnhancedFilters({ filters, onFiltersChange, onClose }: EnhancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const toggleArrayFilter = <K extends keyof FilterOptions>(
    key: K,
    value: string
  ) => {
    const current = (localFilters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated as FilterOptions[K]);
  };

  const clearFilters = () => {
    const cleared: FilterOptions = {};
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : v !== 0)
  );

  return (
    <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="primary" size="sm">
                {Object.values(localFilters).filter((v) =>
                  Array.isArray(v) ? v.length > 0 : v !== undefined && v !== 0
                ).length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Min Compatibility */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Min Compatibility: {localFilters.minCompatibility || 0}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={localFilters.minCompatibility || 0}
              onChange={(e) => updateFilter('minCompatibility', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Experience Level
            </label>
            <div className="flex flex-wrap gap-2">
              {experienceLevels.map((level) => {
                const isSelected = localFilters.experience?.includes(level);
                return (
                  <button
                    key={level}
                    onClick={() => toggleArrayFilter('experience', level)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Availability
            </label>
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map((avail) => {
                const isSelected = localFilters.availability?.includes(avail);
                return (
                  <button
                    key={avail}
                    onClick={() => toggleArrayFilter('availability', avail)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {avail.charAt(0).toUpperCase() + avail.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSkills.map((skill) => {
                const isSelected = localFilters.skills?.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleArrayFilter('skills', skill)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Values */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Values
            </label>
            <div className="flex flex-wrap gap-2">
              {commonValues.map((value) => {
                const isSelected = localFilters.values?.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleArrayFilter('values', value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Industry
            </label>
            <div className="flex flex-wrap gap-2">
              {commonIndustries.map((industry) => {
                const isSelected = localFilters.industry?.includes(industry);
                return (
                  <button
                    key={industry}
                    onClick={() => toggleArrayFilter('industry', industry)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {industry}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Location
            </label>
            <Input
              placeholder="Search locations..."
              value={(localFilters.location || []).join(', ')}
              onChange={(e) => {
                const locations = e.target.value
                  .split(',')
                  .map((l) => l.trim())
                  .filter(Boolean);
                updateFilter('location', locations);
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple locations with commas
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

