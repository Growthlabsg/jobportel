'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { JobFilters as JobFiltersType } from '@/types/job';
import { 
  LOCATIONS, 
  JOB_TYPES, 
  EXPERIENCE_LEVELS,
  INDUSTRIES,
  COMPANY_SIZES,
  FUNDING_STAGES,
  COMMON_SKILLS,
  COMMON_BENEFITS,
} from '@/lib/constants';
import { useStartups } from '@/hooks/useStartups';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-5 last:border-b-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-4 font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-all duration-200 group"
      >
        <span className="text-base">{title}</span>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" />
        </div>
      </button>
      {isOpen && (
        <div className="space-y-2.5 fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

interface CheckboxOption {
  label: string;
  value: string;
  count?: number;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (value: string) => void;
}

const CheckboxGroup = ({ options, selected, onChange }: CheckboxGroupProps) => {
  return (
    <div className="space-y-2.5">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 cursor-pointer hover:text-primary transition-all duration-200 group p-2 rounded-lg hover:bg-primary/5 -ml-2"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 focus:ring-offset-0 cursor-pointer transition-all checked:bg-primary checked:border-primary"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 font-medium flex-1">{option.label}</span>
          {option.count !== undefined && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-medium">
              {option.count}
            </span>
          )}
        </label>
      ))}
    </div>
  );
};

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (filters: JobFiltersType) => void;
}

export const JobFilters = ({ filters, onFilterChange }: JobFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(filters.location || []);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(filters.jobType || []);
  const [selectedExperience, setSelectedExperience] = useState<string[]>(
    filters.experienceLevel || []
  );
  const [selectedRemoteWork, setSelectedRemoteWork] = useState<string[]>(
    filters.remoteWork || []
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    filters.industry || []
  );
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>(
    filters.companySize || []
  );
  const [selectedFundingStages, setSelectedFundingStages] = useState<string[]>(
    filters.fundingStage || []
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(filters.skills || []);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(filters.benefits || []);
  const [skillSearch, setSkillSearch] = useState('');
  const [benefitSearch, setBenefitSearch] = useState('');
  const [salaryMin, setSalaryMin] = useState<string>(filters.salaryMin?.toString() || '');
  const [salaryMax, setSalaryMax] = useState<string>(filters.salaryMax?.toString() || '');
  const [visaSponsorship, setVisaSponsorship] = useState<boolean | undefined>(
    filters.visaSponsorship
  );
  const [featuredOnly, setFeaturedOnly] = useState<boolean | undefined>(filters.featured);
  const [hasTeamCard, setHasTeamCard] = useState<boolean | undefined>(filters.hasTeamCard);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        ...filters,
        search: searchQuery || undefined,
      });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const locations: CheckboxOption[] = LOCATIONS.map((loc) => ({
    label: loc,
    value: loc.toLowerCase().replace(/\s+/g, '-'),
  }));

  const jobTypes: CheckboxOption[] = JOB_TYPES.map((type) => ({
    label: type,
    value: type.toLowerCase().replace(/\s+/g, '-'),
  }));

  const experienceLevels: CheckboxOption[] = EXPERIENCE_LEVELS.map((level) => ({
    label: level,
    value: level.toLowerCase().replace(/\s+/g, '-'),
  }));

  const remoteWorkOptions: CheckboxOption[] = [
    { label: 'On-site', value: 'on-site' },
    { label: 'Remote', value: 'remote' },
    { label: 'Hybrid', value: 'hybrid' },
  ];

  const industries: CheckboxOption[] = INDUSTRIES.map((industry) => ({
    label: industry,
    value: industry.toLowerCase().replace(/\s+/g, '-'),
  }));

  const companySizes: CheckboxOption[] = COMPANY_SIZES.map((size) => ({
    label: size,
    value: size.toLowerCase().replace(/\s+/g, '-'),
  }));

  const fundingStages: CheckboxOption[] = FUNDING_STAGES.map((stage) => ({
    label: stage,
    value: stage.toLowerCase().replace(/\s+/g, '-'),
  }));

  const filteredSkills = COMMON_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  ).slice(0, 10);

  const filteredBenefits = COMMON_BENEFITS.filter((benefit) =>
    benefit.toLowerCase().includes(benefitSearch.toLowerCase())
  ).slice(0, 10);

  const handleLocationToggle = (value: string) => {
    const location = LOCATIONS.find(
      (loc) => loc.toLowerCase().replace(/\s+/g, '-') === value
    )!;
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((l) => l !== location)
      : [...selectedLocations, location];
    setSelectedLocations(newLocations);
    onFilterChange({
      ...filters,
      location: newLocations.length > 0 ? (newLocations as typeof LOCATIONS[number][]) : undefined,
    });
  };

  const handleJobTypeToggle = (value: string) => {
    const jobType = JOB_TYPES.find((type) => type.toLowerCase().replace(/\s+/g, '-') === value)!;
    const newJobTypes = selectedJobTypes.includes(jobType)
      ? selectedJobTypes.filter((t) => t !== jobType)
      : [...selectedJobTypes, jobType];
    setSelectedJobTypes(newJobTypes);
    onFilterChange({
      ...filters,
      jobType: newJobTypes.length > 0 ? (newJobTypes as typeof JOB_TYPES[number][]) : undefined,
    });
  };

  const handleExperienceToggle = (value: string) => {
    const experience = EXPERIENCE_LEVELS.find(
      (level) => level.toLowerCase().replace(/\s+/g, '-') === value
    )!;
    const newExperience = selectedExperience.includes(experience)
      ? selectedExperience.filter((e) => e !== experience)
      : [...selectedExperience, experience];
    setSelectedExperience(newExperience);
    onFilterChange({
      ...filters,
      experienceLevel: newExperience.length > 0 ? (newExperience as typeof EXPERIENCE_LEVELS[number][]) : undefined,
    });
  };

  const handleRemoteWorkToggle = (value: string) => {
    const remoteWorkMap: Record<string, 'On-site' | 'Remote' | 'Hybrid'> = {
      'on-site': 'On-site',
      'remote': 'Remote',
      'hybrid': 'Hybrid',
    };
    const remoteWork = remoteWorkMap[value]!;
    const newRemoteWork = selectedRemoteWork.includes(remoteWork)
      ? selectedRemoteWork.filter((r) => r !== remoteWork)
      : [...selectedRemoteWork, remoteWork];
    setSelectedRemoteWork(newRemoteWork);
    onFilterChange({
      ...filters,
      remoteWork: newRemoteWork.length > 0 ? (newRemoteWork as ('On-site' | 'Remote' | 'Hybrid')[]) : undefined,
    });
  };

  const handleIndustryToggle = (value: string) => {
    const industry = INDUSTRIES.find((ind) => ind.toLowerCase().replace(/\s+/g, '-') === value)!;
    const newIndustries = selectedIndustries.includes(industry)
      ? selectedIndustries.filter((i) => i !== industry)
      : [...selectedIndustries, industry];
    setSelectedIndustries(newIndustries);
    onFilterChange({
      ...filters,
      industry: newIndustries.length > 0 ? newIndustries : undefined,
    });
  };

  const handleCompanySizeToggle = (value: string) => {
    const companySize = COMPANY_SIZES.find((size) => size.toLowerCase().replace(/\s+/g, '-') === value)!;
    const newCompanySizes = selectedCompanySizes.includes(companySize)
      ? selectedCompanySizes.filter((s) => s !== companySize)
      : [...selectedCompanySizes, companySize];
    setSelectedCompanySizes(newCompanySizes);
    onFilterChange({
      ...filters,
      companySize: newCompanySizes.length > 0 ? newCompanySizes : undefined,
    });
  };

  const handleFundingStageToggle = (value: string) => {
    const fundingStage = FUNDING_STAGES.find((stage) => stage.toLowerCase().replace(/\s+/g, '-') === value)!;
    const newFundingStages = selectedFundingStages.includes(fundingStage)
      ? selectedFundingStages.filter((f) => f !== fundingStage)
      : [...selectedFundingStages, fundingStage];
    setSelectedFundingStages(newFundingStages);
    onFilterChange({
      ...filters,
      fundingStage: newFundingStages.length > 0 ? newFundingStages : undefined,
    });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(newSkills);
    onFilterChange({
      ...filters,
      skills: newSkills.length > 0 ? newSkills : undefined,
    });
  };

  const handleBenefitToggle = (benefit: string) => {
    const newBenefits = selectedBenefits.includes(benefit)
      ? selectedBenefits.filter((b) => b !== benefit)
      : [...selectedBenefits, benefit];
    setSelectedBenefits(newBenefits);
    onFilterChange({
      ...filters,
      benefits: newBenefits.length > 0 ? newBenefits : undefined,
    });
  };

  const handleSalaryChange = () => {
    onFilterChange({
      ...filters,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedLocations([]);
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setSelectedRemoteWork([]);
    setSelectedIndustries([]);
    setSelectedCompanySizes([]);
    setSelectedFundingStages([]);
    setSelectedSkills([]);
    setSelectedBenefits([]);
    setSalaryMin('');
    setSalaryMax('');
    setVisaSponsorship(undefined);
    setFeaturedOnly(undefined);
    onFilterChange({
      sortBy: 'recent',
      page: 1,
      limit: 20,
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          Filters
        </h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <FilterSection title="Search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Job title, company, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </FilterSection>

      <FilterSection title="Location">
        <CheckboxGroup
          options={locations}
          selected={selectedLocations.map((l) => l.toLowerCase().replace(/\s+/g, '-'))}
          onChange={handleLocationToggle}
        />
      </FilterSection>

      <FilterSection title="Job Type">
        <CheckboxGroup
          options={jobTypes}
          selected={selectedJobTypes.map((t) => t.toLowerCase().replace(/\s+/g, '-'))}
          onChange={handleJobTypeToggle}
        />
      </FilterSection>

      <FilterSection title="Experience">
        <CheckboxGroup
          options={experienceLevels}
          selected={selectedExperience.map((e) => e.toLowerCase().replace(/\s+/g, '-'))}
          onChange={handleExperienceToggle}
        />
      </FilterSection>

      <FilterSection title="Remote Work">
        <CheckboxGroup
          options={remoteWorkOptions}
          selected={selectedRemoteWork.map((r) => r.toLowerCase().replace(/\s+/g, '-'))}
          onChange={handleRemoteWorkToggle}
        />
      </FilterSection>

      <FilterSection title="Industry">
        <CheckboxGroup
          options={industries}
          selected={selectedIndustries.map((i) => i.toLowerCase().replace(/\s+/g, '-'))}
          onChange={handleIndustryToggle}
        />
      </FilterSection>

      <FilterSection title="Company Size">
        <CheckboxGroup
          options={companySizes}
          selected={selectedCompanySizes.map((s) => s.toLowerCase().replace(/\s+/g, '-'))}
          onChange={handleCompanySizeToggle}
        />
      </FilterSection>

      <FilterSection title="Funding Stage">
        <CheckboxGroup
          options={fundingStages}
          selected={selectedFundingStages.map((f) => f.toLowerCase().replace(/\s+/g, '-'))}
          onChange={handleFundingStageToggle}
        />
      </FilterSection>

      <FilterSection title="Skills">
        <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1"
                  >
                    {skill}
                    <button
                      onClick={() => handleSkillToggle(skill)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredSkills.map((skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">{skill}</span>
                </label>
              ))}
            </div>
          </div>
      </FilterSection>

      <FilterSection title="Benefits">
        <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search benefits..."
                value={benefitSearch}
                onChange={(e) => setBenefitSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            {selectedBenefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedBenefits.map((benefit) => (
                  <Badge
                    key={benefit}
                    variant="default"
                    className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1"
                  >
                    {benefit}
                    <button
                      onClick={() => handleBenefitToggle(benefit)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredBenefits.map((benefit) => (
                <label
                  key={benefit}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(benefit)}
                    onChange={() => handleBenefitToggle(benefit)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">{benefit}</span>
                </label>
              ))}
            </div>
          </div>
      </FilterSection>

      <FilterSection title="Salary Range">
        <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Salary</label>
              <input
                type="number"
                placeholder="Min"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                onBlur={handleSalaryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Salary</label>
              <input
                type="number"
                placeholder="Max"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                onBlur={handleSalaryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Additional Filters">
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visaSponsorship === true}
                onChange={(e) => {
                  const newValue = e.target.checked ? true : undefined;
                  setVisaSponsorship(newValue);
                  onFilterChange({
                    ...filters,
                    visaSponsorship: newValue,
                  });
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Visa Sponsorship</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredOnly === true}
                onChange={(e) => {
                  const newValue = e.target.checked ? true : undefined;
                  setFeaturedOnly(newValue);
                  onFilterChange({
                    ...filters,
                    featured: newValue,
                  });
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Featured Jobs Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasTeamCard === true}
                onChange={(e) => {
                  const newValue = e.target.checked ? true : undefined;
                  setHasTeamCard(newValue);
                  onFilterChange({
                    ...filters,
                    hasTeamCard: newValue,
                  });
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Jobs from Teams Only
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  (Jobs posted by teams in Build Teams section)
                </span>
              </span>
            </label>
          </div>
      </FilterSection>
    </div>
  );
};
