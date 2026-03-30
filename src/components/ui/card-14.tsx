import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useLeaderboardData } from "@/hooks/useLeaderboardData"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

type Card14Props = {
  currentUserRank: number
  currentUserAverage: string
  leaderboardData: ReturnType<typeof useLeaderboardData>["leaderboardData"]
}
const chartConfig = {
  grade: {
    label: "Average",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function calculateGPAtoPercentage(gpa: number): number {
  // Assuming GPA is on a 4.0 scale, convert to percentage
  return Math.max(0, Math.min(100, (gpa / 4.0) * 100));
}

export const Card_14 = ({ currentUserRank, currentUserAverage, leaderboardData }: Card14Props) => {
  const currentUser = leaderboardData.find((item) => item.isCurrentUser)
  const totalStudents = leaderboardData.length
  const averageScore = calculateGPAtoPercentage(parseFloat(currentUserAverage))
  const percentile = totalStudents > 0 ? Math.max(1, Math.round(((totalStudents - currentUserRank + 1) / totalStudents) * 100)) : 0

  return (
    <Card className="relative overflow-hidden border-border p-0 bg-card">
      <CardContent className="relative z-10 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-20">
              <Avatar className="size-20 border-2 border-primary">
                <AvatarImage src={currentUser?.avatarUrl ?? ""} alt={`${currentUser?.name ?? "User"} avatar`} />
                <AvatarFallback>{getInitials(currentUser?.name ?? "User")}</AvatarFallback>
              </Avatar>
              <Badge variant="secondary" className="absolute -bottom-2 -right-2 text-xs font-mono">#{currentUserRank} Rank</Badge>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold">{currentUser?.name ?? "Current User"}</p>
                <p className="truncate text-md text-muted-foreground">{currentUser?.group ?? "No group"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center mt-6 gap-2">
              <Badge variant="outline" className="font-mono">{currentUserAverage}/4.0 Avg</Badge>
              <Badge variant="outline" className="font-mono">Top {percentile}%</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Competing against {totalStudents} students in this semester leaderboard.
            </p>
          </div>

          <div className="mx-auto h-32 w-32 sm:ml-auto sm:mr-0">
            <ChartContainer config={chartConfig} className="h-full w-full aspect-square">
              <RadialBarChart
                data={[{ grade: averageScore }]}
                startAngle={90}
                endAngle={90 + (averageScore / 100) * 360}
                innerRadius={44}
                outerRadius={60}
              >
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-semibold">
                              {`${averageScore.toFixed(1)}%`}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className="fill-muted-foreground text-[10px]">
                              Average
                            </tspan>
                          </text>
                        )
                      }
                      return null
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar dataKey="grade" cornerRadius={8} fill="var(--foreground)" background />
              </RadialBarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
