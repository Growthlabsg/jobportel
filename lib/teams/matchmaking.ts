import { TeamCard, MatchScore } from '@/types/platform';

// Mock user profile for matchmaking (in real app, get from auth/user profile)
export interface UserProfileForMatching {
  userId: string;
  skills: string[];
  interests: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  preferredIndustries: string[];
  preferredCommitment: 'part-time' | 'full-time' | 'flexible';
  preferredRemoteWork: 'on-site' | 'remote' | 'hybrid';
  previousStartups?: number;
}

// Default user profile for demo
export const defaultUserProfile: UserProfileForMatching = {
  userId: 'current-user',
  skills: ['React', 'Node.js', 'TypeScript', 'Product Management', 'UI/UX Design'],
  interests: ['SaaS', 'Climate Tech', 'EdTech'],
  experienceLevel: 'mid',
  preferredIndustries: ['Climate Tech', 'SaaS', 'EdTech'],
  preferredCommitment: 'full-time',
  preferredRemoteWork: 'hybrid',
  previousStartups: 1,
};

/**
 * Calculate match score between user and team
 */
export function calculateMatchScore(
  user: UserProfileForMatching,
  team: TeamCard
): MatchScore {
  const reasons: string[] = [];
  let skillMatch = 0;
  let interestMatch = 0;
  let experienceMatch = 0;

  // Skill Matching (40% weight)
  if (team.requiredSkills && team.requiredSkills.length > 0) {
    const matchingSkills = team.requiredSkills.filter((skill) =>
      user.skills.some(
        (userSkill) => userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    skillMatch = (matchingSkills.length / team.requiredSkills.length) * 100;
    
    if (skillMatch > 50) {
      reasons.push(`${matchingSkills.length} matching skills`);
    }
  } else {
    skillMatch = 50; // Neutral if no skills specified
  }

  // Interest/Industry Matching (30% weight)
  if (user.preferredIndustries.includes(team.industry)) {
    interestMatch = 100;
    reasons.push(`Matches your interest in ${team.industry}`);
  } else if (user.interests.some((interest) => team.industry.toLowerCase().includes(interest.toLowerCase()))) {
    interestMatch = 70;
    reasons.push(`Related to your interests`);
  } else {
    interestMatch = 30;
  }

  // Experience Level Matching (20% weight)
  const experienceLevels = ['entry', 'mid', 'senior', 'executive'];
  const userLevelIndex = experienceLevels.indexOf(user.experienceLevel);
  const teamPositions = team.openPositions.filter((p) => p.status === 'open');
  
  if (teamPositions.length > 0) {
    const avgLevelIndex = teamPositions.reduce((sum, pos) => {
      return sum + experienceLevels.indexOf(pos.experienceLevel);
    }, 0) / teamPositions.length;
    
    const levelDiff = Math.abs(userLevelIndex - avgLevelIndex);
    experienceMatch = Math.max(0, 100 - (levelDiff * 30));
    
    if (levelDiff <= 1) {
      reasons.push('Experience level matches');
    }
  } else {
    experienceMatch = 50; // Neutral if no positions
  }

  // Commitment & Remote Work Matching (10% weight)
  let preferenceMatch = 0;
  if (team.commitmentLevel === user.preferredCommitment) {
    preferenceMatch += 50;
    reasons.push(`Matches your ${user.preferredCommitment} preference`);
  } else if (
    (user.preferredCommitment === 'flexible') ||
    (team.commitmentLevel === 'flexible')
  ) {
    preferenceMatch += 30;
  }

  if (team.remoteWork === user.preferredRemoteWork) {
    preferenceMatch += 50;
  } else if (
    (user.preferredRemoteWork === 'hybrid') ||
    (team.remoteWork === 'hybrid')
  ) {
    preferenceMatch += 25;
  }

  // Calculate overall score
  const overallScore = Math.round(
    skillMatch * 0.4 +
    interestMatch * 0.3 +
    experienceMatch * 0.2 +
    preferenceMatch * 0.1
  );

  // Add bonus for featured teams
  const finalScore = team.featured ? Math.min(100, overallScore + 5) : overallScore;
  if (team.featured && finalScore > overallScore) {
    reasons.push('Featured team');
  }

  // Add bonus for previous startup experience
  if (user.previousStartups && user.previousStartups > 0) {
    const bonus = Math.min(5, user.previousStartups * 2);
    if (bonus > 0) {
      reasons.push('Startup experience');
    }
  }

  return {
    teamCardId: team.id,
    userId: user.userId,
    score: finalScore,
    reasons: reasons.slice(0, 3), // Limit to top 3 reasons
    skillMatch: Math.round(skillMatch),
    interestMatch: Math.round(interestMatch),
    experienceMatch: Math.round(experienceMatch),
  };
}

/**
 * Get top matching teams for a user
 */
export function getTopMatches(
  user: UserProfileForMatching,
  teams: TeamCard[],
  limit: number = 5
): Array<{ team: TeamCard; match: MatchScore }> {
  const matches = teams
    .map((team) => ({
      team,
      match: calculateMatchScore(user, team),
    }))
    .filter((item) => item.match.score > 0) // Only show teams with some match
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);

  return matches;
}

