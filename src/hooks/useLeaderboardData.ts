import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchGroupData, getGroupName } from '@/services/groupService';
import { useUser } from './useUser';
import {
  parseTranscriptData,
  extractYearFromEmail,
  getTrimesterGPA,
  getAverageGPA,
  calculatePerformance,
  type TranscriptData,
} from '@/lib/leaderboardUtils';

type PrivacyVisibility = 'public' | 'group' | 'private';

interface DbPrivacy {
  participate?: boolean;
  visibility?: PrivacyVisibility;
  show_stats?: boolean;
}

interface NormalizedPrivacy {
  participate: boolean;
  visibility: PrivacyVisibility;
  showStats: boolean;
}

export interface LeaderboardUser {
  id: number;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  group: string;
  year: string;
  performance: string;
  gpaByTrimester: {
    trimester1: number | null;
    trimester2: number | null;
    trimester3: number | null;
  };
  averageGPA: number | null;
  isCurrentUser: boolean;
  isGhost?: boolean;
}

interface LeaderboardCandidate extends LeaderboardUser {
  privacy: NormalizedPrivacy;
}

interface RankedUser extends LeaderboardCandidate {
  rankingGPA: number;
  performanceForTrimester: string;
}

function normalizePrivacy(value: unknown): NormalizedPrivacy {
  const maybePrivacy = (value && typeof value === 'object' ? value : {}) as DbPrivacy;

  return {
    participate: maybePrivacy.participate ?? true,
    visibility:
      maybePrivacy.visibility === 'group' ||
      maybePrivacy.visibility === 'private' ||
      maybePrivacy.visibility === 'public'
        ? maybePrivacy.visibility
        : 'public',
    showStats: maybePrivacy.show_stats ?? true,
  };
}

export function useLeaderboardData(
  selectedTrimester: number | null,
  selectedYear: string | null,
  selectedGroup: string | null
) {
  const { user: currentUser } = useUser();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch group data
      const groupMap = await fetchGroupData();

      // Fetch transcript imports with user profiles
      const { data: imports, error: importsError } = await supabase
        .from('transcript_imports')
        .select(`
          id,
          user_id,
          data,
          profiles (
            id,
            full_name,
            avatar_url,
            email,
            privacy
          )
        `)
        .order('user_id', { ascending: true });

      if (importsError) throw importsError;

      if (!imports || imports.length === 0) {
        setLeaderboardData([]);
        return;
      }

      // Transform and filter data
      const users: LeaderboardCandidate[] = [];
      const processedUserIds = new Set<string>();

      imports.forEach((item) => {
        const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
        if (!profile) return;

        const userId = profile.id;
        if (processedUserIds.has(userId)) return; // Skip duplicates
        processedUserIds.add(userId);

        const transcriptData = parseTranscriptData(item.data);
        if (!transcriptData) return;

        const gpaT1 = transcriptData.gpa?.trimester1 ?? null;
        const gpaT2 = transcriptData.gpa?.trimester2 ?? null;
        const gpaT3 = transcriptData.gpa?.trimester3 ?? null;
        const avgGPA = getAverageGPA(transcriptData);

        if (avgGPA === null) return; // Skip if no valid GPA

        const year = extractYearFromEmail(profile.email);
        const performance = avgGPA !== null ? calculatePerformance(avgGPA) : 'At Risk';
        const group = getGroupName(profile.email, groupMap);
        const privacy = normalizePrivacy(profile.privacy);

        users.push({
          id: 0, // Will be set after filtering and sorting
          userId,
          name: profile.full_name || `NPC${userId.slice(0, 5)}`,
          email: profile.email || '',
          avatarUrl: profile.avatar_url || '',
          group,
          year,
          performance,
          gpaByTrimester: {
            trimester1: gpaT1,
            trimester2: gpaT2,
            trimester3: gpaT3,
          },
          averageGPA: avgGPA,
          isCurrentUser: currentUser?.id === userId,
          privacy,
        });
      });

      // Apply filters
      let filtered: LeaderboardCandidate[] = users;

      // Filter by year/course
      if (selectedYear && selectedYear !== 'All') {
        filtered = filtered.filter((u) => u.year === selectedYear);
      }

      // Filter by group
      if (selectedGroup && selectedGroup !== 'All') {
        filtered = filtered.filter((u) => u.group === selectedGroup);
      }

      // Filter by trimester and rank
      if (selectedTrimester && [1, 2, 3].includes(selectedTrimester)) {
        filtered = filtered
          .map((u): RankedUser => {
            const trimesterGPA = getTrimesterGPA(
              { gpa: u.gpaByTrimester } as TranscriptData,
              selectedTrimester
            );

            return {
              ...u,
              rankingGPA: trimesterGPA ?? 0,
              performanceForTrimester: calculatePerformance(trimesterGPA),
            };
          })
          .filter((u) => u.rankingGPA > 0);
      } else {
        // Use average GPA for ranking when "All Trimester" selected
        filtered = filtered.map((u): RankedUser => ({
          ...u,
          rankingGPA: u.averageGPA ?? 0,
          performanceForTrimester: u.performance,
        }));
      }

      // Sort by ranking GPA (descending)
      (filtered as RankedUser[]).sort((a, b) => {
        const aRanking = a.rankingGPA ?? 0;
        const bRanking = b.rankingGPA ?? 0;
        return bRanking - aRanking;
      });

      const scopedGroup = selectedGroup && selectedGroup !== 'All' ? selectedGroup : null;
      const rankedUsers: LeaderboardUser[] = (filtered as RankedUser[]).map((user, index) => {
        const rank = index + 1;
        const privacy = user.privacy;

        // Preserve rank slots by replacing hidden identities with ghost placeholders.
        const shouldHideForViewerByScope =
          privacy.visibility === 'private' ||
          (privacy.visibility === 'group' && scopedGroup !== user.group);

        const isHiddenFromViewer =
          !privacy.participate ||
          shouldHideForViewerByScope;

        if (isHiddenFromViewer && !user.isCurrentUser) {
          return {
            ...user,
            id: rank,
            name: 'Anonymous',
            avatarUrl: '',
            group: '—',
            email: '',
            isGhost: true,
            performance: user.performanceForTrimester,
          };
        }

        return {
          ...user,
          id: rank,
          isGhost: false,
          performance: user.performanceForTrimester,
        };
      });

      setLeaderboardData(rankedUsers);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, selectedGroup, selectedTrimester, selectedYear]);


  useEffect(() => {
    fetchData();

    // Real-time subscription to transcript_imports changes
    const subscription = supabase
      .channel('transcript_imports_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transcript_imports',
        },
        () => {
          console.log('Leaderboard data updated');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchData]);

  return { leaderboardData, isLoading, error };
}
