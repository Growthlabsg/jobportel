import { TeamCard } from '@/types/platform';

/**
 * Calculate trending score for a team
 * Based on views, likes, applications, and recency
 */
export function calculateTrendingScore(team: TeamCard): number {
  const viewsWeight = 0.3;
  const likesWeight = 0.3;
  const applicationsWeight = 0.2;
  const recencyWeight = 0.2;

  // Normalize views (assuming max 10000 views)
  const viewsScore = Math.min(team.viewsCount / 10000, 1) * 100;

  // Normalize likes (assuming max 500 likes)
  const likesScore = Math.min((team.likedBy?.length || team.likesCount) / 500, 1) * 100;

  // Normalize applications (assuming max 100 applications)
  const applicationsScore = Math.min(team.applicationsCount / 100, 1) * 100;

  // Recency score (more recent = higher score)
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(team.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyScore = Math.max(0, 100 - daysSinceUpdate * 5); // Decrease 5 points per day

  const score =
    viewsScore * viewsWeight +
    likesScore * likesWeight +
    applicationsScore * applicationsWeight +
    recencyScore * recencyWeight;

  return Math.round(score);
}

/**
 * Sort teams by trending score
 */
export function sortByTrending(teams: TeamCard[]): TeamCard[] {
  return teams
    .map((team) => ({
      team,
      score: calculateTrendingScore(team),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.team);
}

/**
 * Sort teams by newest first
 */
export function sortByNewest(teams: TeamCard[]): TeamCard[] {
  return [...teams].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Sort teams by most popular (views + likes)
 */
export function sortByPopular(teams: TeamCard[]): TeamCard[] {
  return [...teams].sort(
    (a, b) =>
      (b.viewsCount + (b.likedBy?.length || b.likesCount)) -
      (a.viewsCount + (a.likedBy?.length || a.likesCount))
  );
}

/**
 * Get similar teams based on skills, industry, and stage
 */
export function getSimilarTeams(team: TeamCard, allTeams: TeamCard[], limit: number = 5): TeamCard[] {
  const scores = allTeams
    .filter((t) => t.id !== team.id)
    .map((otherTeam) => {
      let score = 0;

      // Industry match (40%)
      if (otherTeam.industry === team.industry) {
        score += 40;
      }

      // Skills match (30%)
      const commonSkills = team.requiredSkills.filter((skill) =>
        otherTeam.requiredSkills.includes(skill)
      );
      score += (commonSkills.length / Math.max(team.requiredSkills.length, 1)) * 30;

      // Stage match (20%)
      if (otherTeam.stage === team.stage) {
        score += 20;
      }

      // Tags match (10%)
      const commonTags = team.tags.filter((tag) => otherTeam.tags.includes(tag));
      score += (commonTags.length / Math.max(team.tags.length, 1)) * 10;

      return { team: otherTeam, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scores.map((item) => item.team);
}

/**
 * Toggle like for a team
 */
export function toggleTeamLike(team: TeamCard, userId: string): TeamCard {
  const likedBy = team.likedBy || [];
  const isLiked = likedBy.includes(userId);

  return {
    ...team,
    likedBy: isLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId],
    likesCount: isLiked ? Math.max(0, team.likesCount - 1) : team.likesCount + 1,
  };
}

/**
 * Toggle save for a team
 */
export function toggleTeamSave(team: TeamCard, userId: string): TeamCard {
  const savedBy = team.savedBy || [];
  const isSaved = savedBy.includes(userId);

  return {
    ...team,
    savedBy: isSaved ? savedBy.filter((id) => id !== userId) : [...savedBy, userId],
  };
}

