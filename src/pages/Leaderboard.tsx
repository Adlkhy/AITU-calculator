import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card_14 } from '@/components/ui/card-14'
// import type { User } from '@supabase/supabase-js'
import { useUser } from '@/hooks/useUser'
import { DataTable } from '@/components/shadcn/data-table'
import { AppSidebar } from "@/components/shadcn/app-sidebar"
import { DotLoader } from '@/components/shadcn/gsap/dot-loader'
import { fetchGroupData, getGroupName } from '@/services/groupService'
import { Podium } from '@/components/shadcn/podium'
import { SiteHeader } from "@/components/shadcn/site-header"
import { z } from 'zod';
import { Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// eslint-disable-next-line react-refresh/only-export-components
export const leaderboardSchema = z.object({
  id: z.number(),
  name: z.string(), // This will be the user's name
  group: z.string(),   // This will be the group/class
  avatarUrl: z.string().optional(),
  performance: z.string(), // This will be the performance level
  subjects: z.string(), // This will be the number of subjects
  limit: z.string(),  // This will be the semester
  grade: z.string(), // This will be the average grade
  isCurrentUser: z.boolean().optional(), // Enhanced feature: highlight current user
});

export type LeaderboardItem = z.infer<typeof leaderboardSchema>;

export default function Leaderboard() {
  const { user: currentUser, loading} = useUser()
  const  {user } = useUser()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchLeaderboardData = useCallback(async () => {
    try {
      // Fetch group data first
      const groupMap = await fetchGroupData();

      // Fetch all final grades with user profiles
      const { data: gradesData, error: gradesError } = await supabase
        .from('final_grades')
        .select(`
          final_grade,
          subject,
          profiles (
            id,
            full_name,
            avatar_url,
            email
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
        email: string;
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
            user_id: userId,
            email: profile?.email || '',
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
            group: getGroupName(userData.email, groupMap),
            avatarUrl: userData.avatar_url,
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
    // if (!loading && !currentUser) {
    //   navigate('/login', { replace: true });
    //   return;
    // }

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
  const game = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
  ];

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
            <div className="text-center flex items-center gap-5 rounded px-4 py-3">
              <DotLoader 
                frames={game}
                className='gap-0.5'
                color="primary"
                duration={150}
                isPlaying={true}
                dotClassName='bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5' 
              ></DotLoader>
              <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
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
              {(!user && (
                <Card className="mx-4 lg:mx-6 p-0 py-2 border-none bg-accent/30 shadow-none">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="bg-primary/10 p-2 rounded-full mt-1 shrink-0">
                      <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Join the Leaderboard</p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-balance">
                      Login to add your grades and compete fairly with your classmates. Only authenticated users can participate in the leaderboards. Add your grades at <Link to="/final-grades" className="text-primary hover:underline">
                        /final-grades
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
              ))}

              {/* Enhanced: Current User Stats */}
              {currentUserRank > 0 && (
                <div className="px-4 lg:px-6">
                  <Card_14 
                    currentUserRank={currentUserRank} currentUserAverage={currentUserAverage} leaderboardData={leaderboardData} />
                </div>
              )}

              <Podium data={leaderboardData} />
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