import { useEffect, useState } from 'react'
import { Card_14 } from '@/components/ui/card-14'
import { useUser } from '@/hooks/useUser'
import { useLeaderboardData } from '@/hooks/useLeaderboardData'
import { DataTable } from '@/components/shadcn/data-table'
import { AppSidebar } from "@/components/shadcn/app-sidebar"
import { DotLoader } from '@/components/shadcn/gsap/dot-loader'
import { Podium } from '@/components/shadcn/podium'
import { SiteHeader } from "@/components/shadcn/site-header"
import { Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function Leaderboard() {
  const { user: currentUser } = useUser()

  // Filter states
  const [selectedTrimester, setSelectedTrimester] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>('All')
  const [selectedGroup, setSelectedGroup] = useState<string | null>('All')
  const [availableYears, setAvailableYears] = useState<Set<string>>(new Set())
  const [availableGroups, setAvailableGroups] = useState<Set<string>>(new Set())
  const [allAvailableTrimesters, setAllAvailableTrimesters] = useState<number[]>([])

  // Fetch leaderboard data with filters
  const { leaderboardData, isLoading } = useLeaderboardData(
    selectedTrimester,
    selectedYear === 'All' ? null : selectedYear,
    selectedGroup === 'All' ? null : selectedGroup
  )

  // Get unique years, groups, and trimesters from raw data (without filters for dropdowns)
  const { leaderboardData: allData } = useLeaderboardData(null, null, null)

  useEffect(() => {
    const years = new Set<string>()
    const groups = new Set<string>()
    const trimesters = new Set<number>()

    allData.forEach((user) => {
      years.add(user.year)
      groups.add(user.group)
      if (user.gpaByTrimester.trimester1 !== null) trimesters.add(1)
      if (user.gpaByTrimester.trimester2 !== null) trimesters.add(2)
      if (user.gpaByTrimester.trimester3 !== null) trimesters.add(3)
    })

    setAvailableYears(years)
    setAvailableGroups(groups)
    setAllAvailableTrimesters(Array.from(trimesters).sort())
  }, [allData])

  // Transform data for DataTable
  const tableData = leaderboardData.map((user) => ({
    id: user.id,
    name: user.name,
    group: user.group,
    performance: user.performance,
    grade: selectedTrimester && [1, 2, 3].includes(selectedTrimester)
      ? (user.gpaByTrimester[`trimester${selectedTrimester}` as keyof typeof user.gpaByTrimester] ?? 0).toString()
      : (user.averageGPA ?? 0).toString(),
    avatarUrl: user.avatarUrl,
  }))

  // Transform data for Podium
  const podiumData = leaderboardData.map((user) => ({
    id: user.id,
    name: user.name,
    group: user.group,
    grade: (selectedTrimester && [1, 2, 3].includes(selectedTrimester)
      ? (user.gpaByTrimester[`trimester${selectedTrimester}` as keyof typeof user.gpaByTrimester] ?? 0)
      : (user.averageGPA ?? 0)).toString(),
    avatarUrl: user.avatarUrl,
  }))

  // Get current user stats
  const currentUserData = leaderboardData.find((u) => u.isCurrentUser)
  const currentUserRank = currentUserData?.id || 0
  const currentUserGPA = currentUserData?.averageGPA || 0

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

                color="primary"
                duration={150}
                isPlaying={true}
                dotClassName='bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5'
              />
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
              {!currentUser && (
                <Card className="mx-4 lg:mx-6 p-0 py-2 border-none bg-accent/30 shadow-none">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="bg-primary/10 p-2 rounded-full mt-1 shrink-0">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Join the Leaderboard</p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-balance">
                        Login to see your ranking and compete with your classmates. Only authenticated users can participate in the leaderboards.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}


              {/* Current User Stats */}
              {currentUserRank > 0 && (
                <div className="px-4 lg:px-6">
                  <Card_14
                    currentUserRank={currentUserRank}
                    currentUserAverage={currentUserGPA.toFixed(2)}
                    leaderboardData={leaderboardData}
                  />
                </div>
              )}

              {/* Podium */}
              {leaderboardData.length > 0 && (
                <Podium data={podiumData} />
              )}

              {/* Filter Controls */}
              <div className="w-full px-4 lg:px-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="">
                  <Label htmlFor="year-filter" className="text-sm font-medium mb-2">
                    Course
                  </Label>
                  <Select
                    value={selectedYear || 'All'}
                    onValueChange={(value) => setSelectedYear(value)}
                  >
                    <SelectTrigger id="year-filter">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Courses</SelectItem>
                      {Array.from(availableYears)
                        .sort()
                        .map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="">
                  <Label htmlFor="trimester-filter" className="text-sm font-medium mb-2">
                    Trimester
                  </Label>
                  <Select
                    value={selectedTrimester ? `${selectedTrimester}` : 'all'}
                    onValueChange={(value) => setSelectedTrimester(value === 'all' ? null : parseInt(value, 10))}
                  >
                    <SelectTrigger id="trimester-filter">
                      <SelectValue placeholder="Select trimester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trimesters</SelectItem>
                      {allAvailableTrimesters.map((t) => (
                        <SelectItem key={t} value={`${t}`}>
                          Trimester {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="">
                  <Label htmlFor="group-filter" className="text-sm font-medium mb-2">
                    Group
                  </Label>
                  <Select
                    value={selectedGroup || 'All'}
                    onValueChange={(value) => setSelectedGroup(value)}
                  >
                    <SelectTrigger id="group-filter">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Groups</SelectItem>
                      {Array.from(availableGroups)
                        .sort()
                        .map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Table */}
              {leaderboardData.length > 0 ? (
                <DataTable data={tableData} />
              ) : (
                <div className="mx-4 lg:mx-6 text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No Data Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No students found matching your filters. Try adjusting the filters or check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}