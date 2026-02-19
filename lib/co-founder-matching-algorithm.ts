/**
 * Co-Founder Matching Algorithm
 * 7-factor weighted scoring system
 */

import {
  CoFounderProfile,
  CompatibilityBreakdown,
  MatchResult,
  MatchQuality,
  ExperienceLevel,
  Availability,
  CommitmentLevel,
} from '@/types/cofounder';

/**
 * Calculate compatibility score between two profiles
 */
export function calculateCompatibility(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): MatchResult {
  // Calculate individual factor scores
  const skillFit = calculateSkillComplementarity(profile1, profile2);
  const valueAlignment = calculateValueAlignment(profile1, profile2);
  const goalAlignment = calculateGoalAlignment(profile1, profile2);
  const experienceFit = calculateExperienceFit(profile1, profile2);
  const availabilityMatch = calculateAvailabilityMatch(profile1, profile2);
  const locationCompatibility = calculateLocationCompatibility(profile1, profile2);
  const communicationStyle = calculateCommunicationStyle(profile1, profile2);
  
  // Questionnaire-based matching factors
  const startupStatusMatch = calculateStartupStatusMatch(profile1, profile2);
  const timingMatch = calculateTimingMatch(profile1, profile2);
  const responsibilityMatch = calculateResponsibilityMatch(profile1, profile2);
  const preferenceAlignment = calculatePreferenceAlignment(profile1, profile2);

  // Weighted scoring (adjusted to include questionnaire factors)
  const totalScore =
    skillFit * 0.20 +
    valueAlignment * 0.15 +
    goalAlignment * 0.15 +
    experienceFit * 0.12 +
    availabilityMatch * 0.08 +
    locationCompatibility * 0.05 +
    communicationStyle * 0.05 +
    startupStatusMatch * 0.10 +
    timingMatch * 0.05 +
    responsibilityMatch * 0.03 +
    preferenceAlignment * 0.02;

  // Generate breakdown
  const breakdown = generateBreakdown(profile1, profile2);

  // Determine match quality
  const matchQuality = getMatchQuality(totalScore);

  // Generate match reasons
  const matchReasons = generateMatchReasons(
    {
      skillFit,
      valueAlignment,
      goalAlignment,
      experienceFit,
      availabilityMatch,
      locationCompatibility,
      communicationStyle,
    },
    breakdown
  );

  return {
    profile: profile2,
    compatibilityScore: Math.round(totalScore * 100),
    matchQuality,
    breakdown,
    matchReasons,
    detailedBreakdown: {
      skillFit: Math.round(skillFit * 100),
      valueAlignment: Math.round(valueAlignment * 100),
      goalAlignment: Math.round(goalAlignment * 100),
      experienceFit: Math.round(experienceFit * 100),
      availabilityMatch: Math.round(availabilityMatch * 100),
      locationCompatibility: Math.round(locationCompatibility * 100),
      communicationStyle: Math.round(communicationStyle * 100),
    },
  };
}

/**
 * Skill Complementarity (25% weight)
 */
function calculateSkillComplementarity(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const skills1 = new Set(profile1.skills);
  const skills2 = new Set(profile2.skills);

  // Overlapping skills (understanding)
  const overlapping = [...skills1].filter((s) => skills2.has(s));
  const overlapRatio = overlapping.length / Math.max(skills1.size, skills2.size, 1);

  // Complementary skills (team building)
  const complementary1 = [...skills2].filter((s) => !skills1.has(s));
  const complementary2 = [...skills1].filter((s) => !skills2.has(s));
  const complementarityRatio =
    (complementary1.length + complementary2.length) /
    Math.max(skills1.size + skills2.size, 1);

  // Optimal: Some overlap (0.2-0.4) + good complementarity (0.3-0.6)
  const overlapScore = Math.min(overlapRatio / 0.4, 1) * 0.4;
  const complementarityScore = Math.min(complementarityRatio / 0.6, 1) * 0.6;

  return Math.min(overlapScore + complementarityScore, 1);
}

/**
 * Value Alignment (20% weight)
 */
function calculateValueAlignment(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const values1 = new Set(profile1.values);
  const values2 = new Set(profile2.values);

  const aligned = [...values1].filter((v) => values2.has(v));
  const conflicting = identifyConflictingValues(profile1.values, profile2.values);

  const alignmentRatio = aligned.length / Math.max(values1.size, values2.size, 1);
  const conflictPenalty = conflicting.length * 0.2;

  return Math.max(0, Math.min(alignmentRatio - conflictPenalty, 1));
}

/**
 * Goal Alignment (20% weight)
 */
function calculateGoalAlignment(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const goals1 = new Set(profile1.goals);
  const goals2 = new Set(profile2.goals);

  const shared = [...goals1].filter((g) => goals2.has(g));
  const sharedRatio = shared.length / Math.max(goals1.size, goals2.size, 1);

  return Math.min(sharedRatio, 1);
}

/**
 * Experience Fit (15% weight)
 */
function calculateExperienceFit(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const levels: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    expert: 3,
  };

  const level1 = levels[profile1.experience] || 2;
  const level2 = levels[profile2.experience] || 2;

  const diff = Math.abs(level1 - level2);

  // Complementary experience levels preferred
  if (diff === 0) return 0.7; // Same level
  if (diff === 1) return 1.0; // 1 level difference (optimal)
  return 0.5; // 2+ levels difference
}

/**
 * Availability Match (10% weight)
 */
function calculateAvailabilityMatch(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const availabilityMap: Record<string, number> = {
    'full-time': 1.0,
    'part-time': 0.6,
    weekends: 0.3,
  };

  const avail1 = availabilityMap[profile1.availability] || 0.5;
  const avail2 = availabilityMap[profile2.availability] || 0.5;

  // Full-time + Full-time = 1.0
  if (avail1 === 1.0 && avail2 === 1.0) return 1.0;
  // Full-time + Part-time = 0.6
  if ((avail1 === 1.0 && avail2 === 0.6) || (avail1 === 0.6 && avail2 === 1.0))
    return 0.6;
  // Weekends = 0.3
  if (avail1 === 0.3 || avail2 === 0.3) return 0.3;

  return (avail1 + avail2) / 2;
}

/**
 * Location Compatibility (5% weight)
 */
function calculateLocationCompatibility(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  if (profile1.location === profile2.location) return 1.0;

  // Extract country/city from location string (works globally)
  const extractLocationKey = (location: string): string => {
    const loc = location.toLowerCase();
    // Check for major cities
    const cities = ['singapore', 'san francisco', 'new york', 'london', 'berlin', 'tokyo', 'sydney', 'toronto', 'dubai', 'bangalore', 'hong kong', 'seoul', 'amsterdam', 'paris', 'tel aviv', 'austin', 'boston', 'seattle'];
    for (const city of cities) {
      if (loc.includes(city)) return city;
    }
    // Check for regions
    if (loc.includes('asia') || loc.includes('pacific')) return 'asia-pacific';
    if (loc.includes('europe')) return 'europe';
    if (loc.includes('north america') || loc.includes('america')) return 'north-america';
    if (loc.includes('south america')) return 'south-america';
    if (loc.includes('middle east')) return 'middle-east';
    if (loc.includes('africa')) return 'africa';
    if (loc.includes('oceania') || loc.includes('australia')) return 'oceania';
    return loc;
  };

  const loc1 = extractLocationKey(profile1.location);
  const loc2 = extractLocationKey(profile2.location);

  // Same city or exact match
  if (loc1 === loc2) return 0.8;

  // Same region
  if (isSameRegion(profile1.location, profile2.location)) return 0.6;

  // Compatible timezone
  if (profile1.timezone && profile2.timezone && profile1.timezone === profile2.timezone)
    return 0.4;

  // Remote work
  if (profile1.location.toLowerCase().includes('remote') ||
      profile2.location.toLowerCase().includes('remote')) return 0.3;

  return 0.1;
}

/**
 * Communication Style (5% weight)
 */
function calculateCommunicationStyle(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const complementaryPairs: [string, string][] = [
    ['direct', 'diplomatic'],
    ['analytical', 'creative'],
  ];

  // Check if styles are complementary
  for (const [style1, style2] of complementaryPairs) {
    if (
      (profile1.communication === style1 && profile2.communication === style2) ||
      (profile1.communication === style2 && profile2.communication === style1)
    ) {
      return 0.9;
    }
  }

  // Same style
  if (profile1.communication === profile2.communication) return 0.7;

  // Different styles
  return 0.5;
}

/**
 * Generate detailed breakdown
 */
function generateBreakdown(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): CompatibilityBreakdown {
  const skills1 = new Set(profile1.skills);
  const skills2 = new Set(profile2.skills);

  return {
    skills: {
      complementary: [...skills2].filter((s) => !skills1.has(s)),
      overlapping: [...skills1].filter((s) => skills2.has(s)),
      missing: [...skills1].filter((s) => !skills2.has(s)),
    },
    values: {
      aligned: profile1.values.filter((v) => profile2.values.includes(v)),
      conflicting: identifyConflictingValues(profile1.values, profile2.values),
    },
    goals: {
      shared: profile1.goals.filter((g) => profile2.goals.includes(g)),
      different: [
        ...profile1.goals.filter((g) => !profile2.goals.includes(g)),
        ...profile2.goals.filter((g) => !profile1.goals.includes(g)),
      ],
    },
    experience: {
      strengths: identifyStrengths(profile1, profile2),
      gaps: identifyGaps(profile1, profile2),
    },
  };
}

/**
 * Identify conflicting values
 */
function identifyConflictingValues(values1: string[], values2: string[]): string[] {
  // Simplified conflict detection - would need a conflict matrix
  const conflicts: string[] = [];
  // Add logic for identifying conflicting values
  return conflicts;
}

/**
 * Identify combined strengths
 */
function identifyStrengths(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): string[] {
  return [...new Set([...profile1.skills, ...profile2.skills])];
}

/**
 * Identify experience gaps
 */
function identifyGaps(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): string[] {
  // Identify missing critical skills
  return [];
}

/**
 * Determine match quality
 */
function getMatchQuality(score: number): MatchQuality {
  if (score >= 0.9) return 'excellent';
  if (score >= 0.7) return 'good';
  if (score >= 0.5) return 'fair';
  return 'poor';
}

/**
 * Generate match reasons
 */
function generateMatchReasons(
  scores: {
    skillFit: number;
    valueAlignment: number;
    goalAlignment: number;
    experienceFit: number;
    availabilityMatch: number;
    locationCompatibility: number;
    communicationStyle: number;
  },
  breakdown: CompatibilityBreakdown
): string[] {
  const reasons: string[] = [];

  if (scores.skillFit > 0.7) {
    reasons.push(
      `Strong skill complementarity with ${breakdown.skills.complementary.length} complementary skills`
    );
  }

  if (scores.valueAlignment > 0.7) {
    reasons.push(
      `Shared values: ${breakdown.values.aligned.slice(0, 3).join(', ')}`
    );
  }

  if (scores.goalAlignment > 0.7) {
    reasons.push(
      `Aligned goals: ${breakdown.goals.shared.slice(0, 2).join(', ')}`
    );
  }

  if (scores.experienceFit > 0.8) {
    reasons.push('Complementary experience levels');
  }

  if (scores.availabilityMatch > 0.8) {
    reasons.push('Compatible availability');
  }

  return reasons;
}

/**
 * Check if locations are in same region
 */
function isSameRegion(location1: string, location2: string): boolean {
  // Global region mapping
  const asiaPacific = ['singapore', 'malaysia', 'indonesia', 'thailand', 'philippines', 'japan', 'china', 'south korea', 'india', 'hong kong', 'taiwan', 'vietnam', 'bangalore', 'tokyo', 'seoul', 'sydney', 'melbourne', 'auckland'];
  const northAmerica = ['san francisco', 'new york', 'boston', 'seattle', 'austin', 'toronto', 'vancouver', 'montreal', 'los angeles', 'chicago', 'miami', 'washington', 'california', 'texas', 'new york', 'canada', 'united states', 'usa'];
  const europe = ['london', 'berlin', 'amsterdam', 'paris', 'madrid', 'rome', 'barcelona', 'stockholm', 'copenhagen', 'dublin', 'zurich', 'vienna', 'warsaw', 'lisbon', 'brussels', 'munich', 'frankfurt', 'uk', 'germany', 'france', 'spain', 'italy', 'netherlands'];
  const middleEast = ['dubai', 'abu dhabi', 'tel aviv', 'riyadh', 'doha', 'kuwait', 'bahrain', 'israel', 'saudi arabia', 'uae'];
  const southAmerica = ['são paulo', 'rio de janeiro', 'buenos aires', 'santiago', 'bogotá', 'lima', 'mexico city', 'brazil', 'argentina', 'chile', 'colombia'];
  const africa = ['cape town', 'johannesburg', 'lagos', 'nairobi', 'cairo', 'south africa', 'kenya', 'nigeria', 'egypt'];
  const oceania = ['sydney', 'melbourne', 'auckland', 'wellington', 'brisbane', 'perth', 'australia', 'new zealand'];

  const loc1 = location1.toLowerCase();
  const loc2 = location2.toLowerCase();

  const checkRegion = (regions: string[]) => 
    regions.some((r) => loc1.includes(r)) && regions.some((r) => loc2.includes(r));

  return (
    checkRegion(asiaPacific) ||
    checkRegion(northAmerica) ||
    checkRegion(europe) ||
    checkRegion(middleEast) ||
    checkRegion(southAmerica) ||
    checkRegion(africa) ||
    checkRegion(oceania)
  );
}

/**
 * Startup Status Match (10% weight)
 * Matches based on startup idea status compatibility
 */
function calculateStartupStatusMatch(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const status1 = profile1.startupIdeaStatus;
  const status2 = profile2.startupIdeaStatus;

  if (!status1 || !status2) return 0.5; // Neutral if not specified

  // Committed + Committed = good (both have ideas)
  if (status1 === 'committed' && status2 === 'committed') return 0.8;
  
  // Committed + Exploring = excellent (one has idea, other is flexible)
  if ((status1 === 'committed' && status2 === 'exploring') || 
      (status1 === 'exploring' && status2 === 'committed')) return 1.0;
  
  // Exploring + Exploring = good (both flexible)
  if (status1 === 'exploring' && status2 === 'exploring') return 0.9;
  
  // Help-existing + Committed = excellent (perfect match)
  if ((status1 === 'help-existing' && status2 === 'committed') ||
      (status1 === 'committed' && status2 === 'help-existing')) return 1.0;
  
  // Help-existing + Exploring = good
  if ((status1 === 'help-existing' && status2 === 'exploring') ||
      (status1 === 'exploring' && status2 === 'help-existing')) return 0.8;
  
  // Help-existing + Help-existing = fair (both want to help, but no clear idea)
  if (status1 === 'help-existing' && status2 === 'help-existing') return 0.6;

  return 0.5;
}

/**
 * Timing Match (5% weight)
 * Matches based on full-time timing preferences
 */
function calculateTimingMatch(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const timing1 = profile1.fullTimeTiming;
  const timing2 = profile2.fullTimeTiming;

  if (!timing1 || !timing2) return 0.5;

  // Both already full-time = excellent
  if (timing1.includes('already full-time') && timing2.includes('already full-time')) return 1.0;
  
  // Both ready to go full-time = excellent
  if (timing1.includes('ready to go full-time') && timing2.includes('ready to go full-time')) return 1.0;
  
  // One already full-time + one ready = excellent
  if ((timing1.includes('already full-time') && timing2.includes('ready to go full-time')) ||
      (timing1.includes('ready to go full-time') && timing2.includes('already full-time'))) return 1.0;
  
  // Planning in next year + ready/already = good
  if ((timing1.includes('next year') && (timing2.includes('ready') || timing2.includes('already'))) ||
      ((timing1.includes('ready') || timing1.includes('already')) && timing2.includes('next year'))) return 0.7;
  
  // Both planning in next year = good
  if (timing1.includes('next year') && timing2.includes('next year')) return 0.8;
  
  // No specific plans = lower score
  if (timing1.includes('no specific plans') || timing2.includes('no specific plans')) return 0.4;

  return 0.5;
}

/**
 * Responsibility Match (3% weight)
 * Matches based on responsibility areas complementarity
 */
function calculateResponsibilityMatch(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  const areas1 = new Set(profile1.responsibilityAreas || []);
  const areas2 = new Set(profile2.responsibilityAreas || []);

  if (areas1.size === 0 || areas2.size === 0) return 0.5;

  // Overlapping areas (understanding)
  const overlapping = [...areas1].filter((a) => areas2.has(a));
  
  // Complementary areas (team building)
  const complementary1 = [...areas2].filter((a) => !areas1.has(a));
  const complementary2 = [...areas1].filter((a) => !areas2.has(a));
  
  const overlapRatio = overlapping.length / Math.max(areas1.size, areas2.size, 1);
  const complementarityRatio = (complementary1.length + complementary2.length) / Math.max(areas1.size + areas2.size, 1);
  
  // Optimal: Some overlap (0.2-0.4) + good complementarity (0.3-0.6)
  const overlapScore = Math.min(overlapRatio / 0.4, 1) * 0.4;
  const complementarityScore = Math.min(complementarityRatio / 0.6, 1) * 0.6;
  
  return Math.min(overlapScore + complementarityScore, 1);
}

/**
 * Preference Alignment (2% weight)
 * Matches based on co-founder preferences alignment
 */
function calculatePreferenceAlignment(
  profile1: CoFounderProfile,
  profile2: CoFounderProfile
): number {
  let score = 0;
  let factors = 0;

  // Idea preference alignment
  if (profile1.ideaPreference && profile2.ideaPreference) {
    factors++;
    if (profile1.ideaPreference === profile2.ideaPreference || 
        profile1.ideaPreference === 'no-preference' || 
        profile2.ideaPreference === 'no-preference') {
      score += 1.0;
    } else if ((profile1.ideaPreference === 'specific' && profile2.ideaPreference === 'open') ||
               (profile1.ideaPreference === 'open' && profile2.ideaPreference === 'specific')) {
      score += 0.7; // Can work together
    } else {
      score += 0.3;
    }
  }

  // Technical preference alignment
  if (profile1.technicalPreference && profile2.technicalPreference) {
    factors++;
    const tech1 = profile1.technicalStatus;
    const tech2 = profile2.technicalStatus;
    
    if (profile1.technicalPreference === 'no-preference' || profile2.technicalPreference === 'no-preference') {
      score += 1.0;
    } else if ((profile1.technicalPreference === 'technical' && tech2) ||
               (profile1.technicalPreference === 'non-technical' && !tech2) ||
               (profile2.technicalPreference === 'technical' && tech1) ||
               (profile2.technicalPreference === 'non-technical' && !tech1)) {
      score += 1.0; // Matches preference
    } else {
      score += 0.2; // Doesn't match preference
    }
  }

  // Preferred responsibility areas alignment
  if (profile1.preferredResponsibilityAreas && profile2.preferredResponsibilityAreas &&
      profile1.preferredResponsibilityAreas.length > 0 && profile2.preferredResponsibilityAreas.length > 0) {
    factors++;
    const pref1 = new Set(profile1.preferredResponsibilityAreas);
    const pref2 = new Set(profile2.preferredResponsibilityAreas);
    const actual1 = new Set(profile1.responsibilityAreas);
    const actual2 = new Set(profile2.responsibilityAreas);
    
    // Check if profile2's actual areas match profile1's preferences
    const match1 = [...pref1].filter((a) => actual2.has(a)).length;
    // Check if profile1's actual areas match profile2's preferences
    const match2 = [...pref2].filter((a) => actual1.has(a)).length;
    
    const matchRatio = (match1 + match2) / Math.max(pref1.size + pref2.size, 1);
    score += matchRatio;
  }

  return factors > 0 ? score / factors : 0.5;
}

/**
 * Match profiles with filters
 */
export function matchProfiles(
  userProfile: CoFounderProfile,
  allProfiles: CoFounderProfile[],
  filters?: {
    minCompatibility?: number;
    minScore?: number;
    location?: string[];
    experience?: ExperienceLevel[];
    availability?: Availability[];
    skills?: string[];
    values?: string[];
    industry?: string[];
    commitment?: CommitmentLevel[];
    languages?: string[];
    timezone?: string[];
  }
): MatchResult[] {
  // Filter profiles
  let filtered = allProfiles.filter((p) => p.id !== userProfile.id);

  if (filters) {
    if (filters.location && filters.location.length > 0) {
      filtered = filtered.filter((p) =>
        filters.location!.some((loc) => p.location.toLowerCase().includes(loc.toLowerCase()))
      );
    }

    if (filters.experience && filters.experience.length > 0) {
      filtered = filtered.filter((p) => filters.experience!.includes(p.experience));
    }

    if (filters.availability && filters.availability.length > 0) {
      filtered = filtered.filter((p) => filters.availability!.includes(p.availability));
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((p) =>
        filters.skills!.some((skill) => p.skills.includes(skill))
      );
    }

    if (filters.values && filters.values.length > 0) {
      filtered = filtered.filter((p) =>
        filters.values!.some((value) => p.values.includes(value))
      );
    }

    if (filters.industry && filters.industry.length > 0) {
      filtered = filtered.filter((p) =>
        filters.industry!.some((ind) => p.industry.includes(ind))
      );
    }

    if (filters.commitment && filters.commitment.length > 0) {
      filtered = filtered.filter((p) => filters.commitment!.includes(p.commitment));
    }

    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter((p) =>
        filters.languages!.some((lang) => p.languages.includes(lang))
      );
    }

    if (filters.timezone && filters.timezone.length > 0) {
      filtered = filtered.filter((p) =>
        p.timezone && filters.timezone!.includes(p.timezone)
      );
    }
  }

  // Calculate compatibility for each profile
  const matches = filtered.map((profile) => calculateCompatibility(userProfile, profile));

  // Apply minimum compatibility filter
  const minScore = filters?.minCompatibility || filters?.minScore || 0;
  const filteredMatches = matches.filter((m) => m.compatibilityScore >= minScore);

  // Sort by compatibility score (best matches first)
  return filteredMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

