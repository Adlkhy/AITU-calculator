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

const MIN_LEADERBOARD_SIZE = 24;

type SeededUserPreset = {
  name: string;
  group: string;
  year: string;
  gpaByTrimester: {
    trimester1: number;
    trimester2: number;
    trimester3: number;
  };
};

const SEEDED_USER_PRESETS: SeededUserPreset[] = [
  { name: 'Ayan', group: 'SE-2301', year: 'Senior (3rd year)', gpaByTrimester: { trimester1: 3.92, trimester2: 3.88, trimester3: 3.95 } },
  { name: 'Maya', group: 'SE-2302', year: 'Senior (3rd year)', gpaByTrimester: { trimester1: 3.86, trimester2: 3.81, trimester3: 3.9 } },
  { name: 'Lina', group: 'BDA-2303', year: 'Senior (3rd year)', gpaByTrimester: { trimester1: 3.78, trimester2: 3.74, trimester3: 3.8 } },
  { name: 'Arman', group: 'ITM-2201', year: 'Junior (2nd year)', gpaByTrimester: { trimester1: 3.62, trimester2: 3.68, trimester3: 3.71 } },
  { name: 'Sana', group: 'ITM-2202', year: 'Junior (2nd year)', gpaByTrimester: { trimester1: 3.58, trimester2: 3.55, trimester3: 3.63 } },
  { name: 'Jules', group: 'CS-2204', year: 'Junior (2nd year)', gpaByTrimester: { trimester1: 3.49, trimester2: 3.53, trimester3: 3.56 } },
  { name: 'Nika', group: 'SE-2205', year: 'Junior (2nd year)', gpaByTrimester: { trimester1: 3.45, trimester2: 3.47, trimester3: 3.5 } },
  { name: 'Omar', group: 'BDA-2206', year: 'Junior (2nd year)', gpaByTrimester: { trimester1: 3.33, trimester2: 3.39, trimester3: 3.42 } },
  { name: 'Iris', group: 'IT-2401', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 3.29, trimester2: 3.24, trimester3: 3.35 } },
  { name: 'Tariq', group: 'IT-2402', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 3.21, trimester2: 3.26, trimester3: 3.19 } },
  { name: 'Elina', group: 'DJ-2403', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 3.14, trimester2: 3.2, trimester3: 3.18 } },
  { name: 'Maksat', group: 'DJ-2404', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 3.08, trimester2: 3.12, trimester3: 3.16 } },
  { name: 'Noel', group: 'MT-2405', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 2.98, trimester2: 3.03, trimester3: 3.07 } },
  { name: 'Ari', group: 'MT-2406', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 2.93, trimester2: 2.97, trimester3: 3.01 } },
  { name: 'Hana', group: 'SE-2407', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 2.82, trimester2: 2.9, trimester3: 2.94 } },
  { name: 'Kai', group: 'SE-2408', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 2.74, trimester2: 2.79, trimester3: 2.83 } },
  { name: 'Liam', group: 'ITM-2413', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 2.33, trimester2: 2.39, trimester3: 2.35 } },
  { name: 'Mira', group: 'ITM-2414', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 2.22, trimester2: 2.3, trimester3: 2.27 } },
  { name: 'Niko', group: 'IIOT-2415', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 2.08, trimester2: 2.15, trimester3: 2.12 } },
  { name: 'Zara', group: 'IIOT-2416', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 1.96, trimester2: 2.01, trimester3: 2.06 } },
  { name: 'Pavel', group: 'ST-2417', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 1.88, trimester2: 1.94, trimester3: 1.99 } },
  { name: 'Sora', group: 'ST-2418', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 1.74, trimester2: 1.81, trimester3: 1.86 } },
  { name: 'Toma', group: 'DJ-2419', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 1.59, trimester2: 1.64, trimester3: 1.71 } },
  { name: 'Aila', group: 'MT-2420', year: 'Freshman (1st year)', gpaByTrimester: { trimester1: 1.36, trimester2: 1.44, trimester3: 1.52 } },
];

function createSeededLeaderboardUsers(currentUserId?: string): LeaderboardCandidate[] {
  return SEEDED_USER_PRESETS.map((preset, index) => {
    const averageGPA = getAverageGPA({ gpa: preset.gpaByTrimester });

    return {
      id: 0,
      userId: `seed-user-${index + 1}`,
      name: preset.name,
      email: `seed${index + 1}@leaderboard.local`,
      avatarUrl: `https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(preset.name)}&backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy`,
      group: preset.group,
      year: preset.year,
      performance: calculatePerformance(averageGPA),
      gpaByTrimester: {
        trimester1: preset.gpaByTrimester.trimester1,
        trimester2: preset.gpaByTrimester.trimester2,
        trimester3: preset.gpaByTrimester.trimester3,
      },
      averageGPA,
      isCurrentUser: currentUserId === `seed-user-${index + 1}`,
      privacy: {
        participate: true,
        visibility: 'public',
        showStats: true,
      },
    };
  });
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

      if (users.length < MIN_LEADERBOARD_SIZE) {
        const seededUsers = createSeededLeaderboardUsers(currentUser?.id);
        const neededCount = MIN_LEADERBOARD_SIZE - users.length;
        users.push(...seededUsers.slice(0, neededCount));
      }

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
