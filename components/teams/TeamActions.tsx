'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TeamCard as TeamCardType } from '@/types/platform';
import { Heart, Bookmark, Share2, MoreVertical, Copy, Check } from 'lucide-react';
import { toggleTeamLike, toggleTeamSave } from '@/lib/teams/team-utils';

interface TeamActionsProps {
  team: TeamCardType;
  onLike?: (team: TeamCardType) => void;
  onSave?: (team: TeamCardType) => void;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TeamActions({
  team,
  onLike,
  onSave,
  showLabels = false,
  size = 'md',
}: TeamActionsProps) {
  const [isLiked, setIsLiked] = useState(
    (team.likedBy || []).includes('current-user') || false
  );
  const [isSaved, setIsSaved] = useState(
    (team.savedBy || []).includes('current-user') || false
  );
  const [isShared, setIsShared] = useState(false);

  const handleLike = () => {
    const updatedTeam = toggleTeamLike(team, 'current-user');
    setIsLiked(!isLiked);
    onLike?.(updatedTeam);
  };

  const handleSave = () => {
    const updatedTeam = toggleTeamSave(team, 'current-user');
    setIsSaved(!isSaved);
    onSave?.(updatedTeam);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/jobs/build-teams/${team.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: team.name,
          text: team.description,
          url,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(url);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size={size}
        onClick={handleLike}
        className={`${sizeClasses[size]} p-0 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors ${
          isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : ''
        }`}
        title={isLiked ? 'Unlike' : 'Like'}
      >
        <Heart className={`${iconSizes[size]} ${isLiked ? 'fill-current' : ''}`} />
      </Button>
      {showLabels && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {team.likedBy?.length || team.likesCount || 0}
        </span>
      )}

      <Button
        variant="ghost"
        size={size}
        onClick={handleSave}
        className={`${sizeClasses[size]} p-0 hover:bg-yellow-50 hover:text-yellow-500 dark:hover:bg-yellow-900/20 transition-colors ${
          isSaved ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : ''
        }`}
        title={isSaved ? 'Unsave' : 'Save'}
      >
        <Bookmark className={`${iconSizes[size]} ${isSaved ? 'fill-current' : ''}`} />
      </Button>

      <Button
        variant="ghost"
        size={size}
        onClick={handleShare}
        className={`${sizeClasses[size]} p-0 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20 transition-colors ${
          isShared ? 'text-green-500' : ''
        }`}
        title="Share"
      >
        {isShared ? (
          <Check className={iconSizes[size]} />
        ) : (
          <Share2 className={iconSizes[size]} />
        )}
      </Button>
    </div>
  );
}

