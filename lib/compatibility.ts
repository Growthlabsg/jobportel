import { CoFounderProfile, CompatibilityMatch } from '@/types/cofounder';

/**
 * Calculate compatibility score between two co-founder profiles
 * Returns a score from 0-100 based on multiple factors
 */
export function calculateCompatibility(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): CompatibilityMatch {
  const factors = {
    skillsComplement: calculateSkillsComplement(profile1, profile2),
    valuesAlignment: calculateValuesAlignment(profile1, profile2),
    experienceMatch: calculateExperienceMatch(profile1, profile2),
    locationMatch: calculateLocationMatch(profile1, profile2),
    availabilityMatch: calculateAvailabilityMatch(profile1, profile2),
    commitmentMatch: calculateCommitmentMatch(profile1, profile2),
    industryMatch: calculateIndustryMatch(profile1, profile2),
  };

  // Weighted average
  const weights = {
    skillsComplement: 0.25,
    valuesAlignment: 0.20,
    experienceMatch: 0.15,
    locationMatch: 0.10,
    availabilityMatch: 0.10,
    commitmentMatch: 0.10,
    industryMatch: 0.10,
  };

  const totalScore =
    factors.skillsComplement * weights.skillsComplement +
    factors.valuesAlignment * weights.valuesAlignment +
    factors.experienceMatch * weights.experienceMatch +
    factors.locationMatch * weights.locationMatch +
    factors.availabilityMatch * weights.availabilityMatch +
    factors.commitmentMatch * weights.commitmentMatch +
    factors.industryMatch * weights.industryMatch;

  return {
    profileId: profile2.id,
    score: Math.round(totalScore),
    factors,
  };
}

/**
 * Calculate skills complementarity
 * Higher score if skills complement each other (different but relevant)
 */
function calculateSkillsComplement(profile1: CoFounderProfile, profile2: CoFounderProfile): number {
  const skills1 = profile1.skills || [];
  const skills2 = profile2.skills || [];

  if (skills1.length === 0 || skills2.length === 0) {
    return 50;
  }

  const overlap = skills1.filter((s) => skills2.includes(s)).length;
  const totalUnique = new Set([...skills1, ...skills2]).size;
  const overlapRatio = totalUnique > 0 ? overlap / totalUnique : 0;
  const complementScore = overlapRatio > 0.5 ? 70 : overlapRatio > 0.2 ? 85 : 100;
  const overlapBonus = Math.min(overlap * 3, 20);

  return Math.min(complementScore + overlapBonus, 100);
}

/**
 * Calculate values alignment
 * Higher score if they share similar values
 */
function calculateValuesAlignment(profile1: CoFounderProfile, profile2: CoFounderProfile): number {
  const values1 = profile1.values || [];
  const values2 = profile2.values || [];

  if (values1.length === 0 || values2.length === 0) {
    return 50; // Neutral if no values specified
  }

  const commonValues = values1.filter((v) => values2.includes(v));
  const alignment = (commonValues.length / Math.max(values1.length, values2.length)) * 100;

  return Math.round(alignment);
}

/**
 * Calculate experience match
 * Higher score if experience levels are compatible
 */
function calculateExperienceMatch(profile1: CoFounderProfile, profile2: CoFounderProfile): number {
  const level1 = profile1.experience;
  const level2 = profile2.experience;

  const levels: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    expert: 3,
  };

  const diff = Math.abs((levels[level1] ?? 2) - (levels[level2] ?? 2));
  if (diff === 0) return 90;
  if (diff === 1) return 85;
  return 70;
}

/**
 * Calculate location match
 * Higher score if same location or compatible timezones
 */
function calculateLocationMatch(profile1: CoFounderProfile, profile2: CoFounderProfile): number {
  const loc1 = (profile1.location || '').toLowerCase();
  const loc2 = (profile2.location || '').toLowerCase();

  if (loc1 === loc2) {
    return 100;
  }

  // Extract city/country from location (works globally)
  const extractKeyLocation = (location: string): string => {
    const loc = location.toLowerCase();
    // Check for major global cities
    const majorCities = ['singapore', 'san francisco', 'new york', 'london', 'berlin', 'tokyo', 'sydney', 'toronto', 'dubai', 'bangalore', 'hong kong', 'seoul', 'amsterdam', 'paris', 'tel aviv', 'austin', 'boston', 'seattle'];
    for (const city of majorCities) {
      if (loc.includes(city)) return city;
    }
    return loc;
  };

  const key1 = extractKeyLocation(profile1.location);
  const key2 = extractKeyLocation(profile2.location);

  // Same city
  if (key1 === key2 && key1 !== '') {
    return 100;
  }

  // Check timezone compatibility
  const tz1 = profile1.timezone;
  const tz2 = profile2.timezone;

  if (tz1 && tz2 && tz1 === tz2) {
    return 90;
  }

  // Extract UTC offset if available
  const tz1Match = tz1?.match(/UTC([+-]\d+)/);
  const tz2Match = tz2?.match(/UTC([+-]\d+)/);

  if (tz1Match && tz2Match) {
    const offset1 = parseInt(tz1Match[1]);
    const offset2 = parseInt(tz2Match[1]);
    const diff = Math.abs(offset1 - offset2);

    if (diff === 0) return 100;
    if (diff <= 2) return 80; // Within 2 hours
    if (diff <= 4) return 60; // Within 4 hours
    if (diff <= 8) return 40; // Within 8 hours
    return 20; // Very different timezones
  }

  // Remote work compatibility
  if (loc1.includes('remote') || loc2.includes('remote')) {
    return 70; // Remote work is globally compatible
  }

  return 50; // Default neutral
}

/**
 * Calculate availability match
 * Higher score if availability types are compatible
 */
function calculateAvailabilityMatch(profile1: CoFounderProfile, profile2: CoFounderProfile): number {
  const avail1 = profile1.availability;
  const avail2 = profile2.availability;

  if (avail1 === avail2) return 100;
  if (
    (avail1 === 'full-time' && avail2 === 'full-time') ||
    (avail1 === 'part-time' && avail2 === 'part-time')
  ) {
    return 100;
  }
  if (
    (avail1 === 'full-time' && avail2 === 'part-time') ||
    (avail1 === 'part-time' && avail2 === 'full-time')
  ) {
    return 60;
  }
  return 40;
}

/**
 * Calculate commitment match
 * Higher score if commitment levels are similar
 */
function calculateCommitmentMatch(profile1: CoFounderProfile, profile2: CoFounderProfile): number {
  const commit1 = profile1.commitment;
  const commit2 = profile2.commitment;

  if (commit1 === commit2) return 100;
  if (
    (commit1 === 'high' && commit2 === 'medium') ||
    (commit1 === 'medium' && commit2 === 'high')
  ) {
    return 80;
  }
  if (
    (commit1 === 'high' && commit2 === 'low') ||
    (commit1 === 'low' && commit2 === 'high')
  ) {
    return 30;
  }
  return 50;
}

/**
 * Calculate industry match
 * Higher score if industries overlap
 */
function calculateIndustryMatch(profile1: CoFounderProfile, profile2: CoFounderProfile): number {
  const industries1 = profile1.industry || [];
  const industries2 = profile2.industry || [];

  if (industries1.length === 0 || industries2.length === 0) {
    return 50;
  }

  const common = industries1.filter((i) => industries2.includes(i));
  const match = (common.length / Math.max(industries1.length, industries2.length)) * 100;
  return Math.round(match);
}

