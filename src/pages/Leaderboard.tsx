import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
// import type { User } from '@supabase/supabase-js'
import { useUser } from '@/hooks/useUser'
import { DataTable } from '@/components/shadcn/data-table'
import { AppSidebar } from "@/components/shadcn/app-sidebar"
// import { ChartAreaInteractive } from "@/components/shadcn/chart-area-interactive"
// import { SectionCards } from "@/components/shadcn/section-cards"
import { SiteHeader } from "@/components/shadcn/site-header"
import { z } from 'zod';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// eslint-disable-next-line react-refresh/only-export-components
export const leaderboardSchema = z.object({
  id: z.number(),
  name: z.string(), // This will be the user's name
  group: z.string(),   // This will be the group/class
  performance: z.string(), // This will be the performance level
  subjects: z.string(), // This will be the number of subjects
  limit: z.string(),  // This will be the semester
  grade: z.string(), // This will be the average grade
  isCurrentUser: z.boolean().optional(), // Enhanced feature: highlight current user
});

export type LeaderboardItem = z.infer<typeof leaderboardSchema>;

export default function Leaderboard() {
  const { user: currentUser, loading} = useUser()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchLeaderboardData = useCallback(async () => {
    try {
      // Fetch all final grades with user profiles
      const { data: gradesData, error: gradesError } = await supabase
        .from('final_grades')
        .select(`
          final_grade,
          subject,
          profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('semester', 'Fall 2025');

      if (gradesError) throw gradesError;

      // Calculate averages per user
      const userAverages: Record<string, {
        total: number;
        count: number;
        full_name: string;
        avatar_url: string;
        user_id: string;
      }> = {};

      gradesData?.forEach(item => {
        // Supabase can return the related profiles as an array; take the first profile if present
        const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
        const userId = profile?.id ?? 'unknown';

        if (!userAverages[userId]) {
          userAverages[userId] = {
            total: 0,
            count: 0,
            full_name: profile?.full_name || 'NPC'+userId.slice(0, 5),
            avatar_url: profile?.avatar_url || '',
            user_id: userId
          };
        }
        userAverages[userId].total += item.final_grade ?? 0;
        userAverages[userId].count += 1;
      });

      // Convert to leaderboard format
      const leaderboardItems: LeaderboardItem[] = Object.entries(userAverages)
        .map(([, userData]) => {
          const average = userData.total / userData.count;
          
          // Determine performance level based on average
          let status = 'At Risk';
          if (average >= 90) status = 'Nerd';
          else if (average >= 70) status = 'Survivor';
          else if (average < 50) status = 'RIP';

          // Enhanced: Check if this is the current user
          const isCurrentUser = currentUser?.id === userData.user_id;

          return {
            id: 0, // Temporary ID, will be set after sorting
            name: userData.full_name,
            group: 'None', // You can make this dynamic
            performance: status,
            subjects: `${userData.count} subjects`, // Number of subjects completed
            limit: 'Fall 2025',
            grade: `${average.toFixed(1)}%`, // Average grade
            isCurrentUser: isCurrentUser
          };
        })
        .sort((a, b) => {
          // Sort by average grade (descending)
          const aGrade = parseFloat(a.grade);
          const bGrade = parseFloat(b.grade);
          return bGrade - aGrade;
        })
        .map((item, index) => ({
          ...item,
          id: index + 1, // Set final rank as ID
        }));

      setLeaderboardData(leaderboardItems);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    // Initial data fetch
    fetchLeaderboardData();

    // Real-time subscription to final_grades changes
    const subscription = supabase
      .channel('final_grades_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'final_grades'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchLeaderboardData(); // Refresh when grades change
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, loading, fetchLeaderboardData, navigate]);

  // Enhanced: Get current user's rank and stats
  const currentUserRank = leaderboardData.find(item => item.isCurrentUser)?.id || 0;
  const currentUserAverage = leaderboardData.find(item => item.isCurrentUser)?.grade || '0%';

  if (isLoading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-foreground">Loading leaderboard... let's see where you at</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              
              {/* Enhanced: Current User Stats */}
              {currentUserRank > 0 && (
                <div className="px-4 lg:px-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold mb-2">Your Ranking</h2>
                        <p className="text-blue-100">
                          You are ranked <span className="font-bold text-2xl">#{currentUserRank}</span> out of {leaderboardData.length} students
                        </p>
                        <p className="text-blue-100">
                          Average Grade: <span className="font-bold text-xl">{currentUserAverage}</span>
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{currentUserRank}</div>
                            <div className="text-blue-200 text-sm">Rank</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{currentUserAverage}</div>
                            <div className="text-blue-200 text-sm">Average</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* <SectionCards /> */}
              
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              
              {/* Enhanced DataTable with real-time data */}
              <DataTable data={leaderboardData} />
            </div>
            
            {/* Enhanced Empty State */}
            {leaderboardData.length === 0 && (
              <div className="text-center py-12 px-4">
                <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
                <p className="text-foreground mb-4">
                  Students haven't entered their final grades yet. Check back later!
                </p>
                <button 
                  onClick={() => navigate('/final-grades')}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Enter Your Grades
                </button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}