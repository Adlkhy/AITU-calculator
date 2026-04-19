import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useLeaderboardData } from "@/hooks/useLeaderboardData"

type ConsistentCardProps = {
  leaderboardData: ReturnType<typeof useLeaderboardData>["leaderboardData"]
}

type LeaderboardItem = ReturnType<typeof useLeaderboardData>["leaderboardData"][number]

type ConsistentInfo = {
  student: LeaderboardItem
  startTrimester: 1 | 2
  endTrimester: 2 | 3
  totalChange: number
  averageStepChange: number
  stepCount: number
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function getMostConsistentStudent(data: LeaderboardItem[]): ConsistentInfo | null {
  return data.reduce<ConsistentInfo | null>((best, student) => {
    const deltas: Array<{ fromTrimester: 1 | 2; toTrimester: 2 | 3; change: number }> = []
    const t1 = student.gpaByTrimester.trimester1
    const t2 = student.gpaByTrimester.trimester2
    const t3 = student.gpaByTrimester.trimester3

    if (t1 !== null && t2 !== null) {
      const change = t2 - t1
      if (change < 0) return best
      deltas.push({ fromTrimester: 1, toTrimester: 2, change })
    }

    if (t2 !== null && t3 !== null) {
      const change = t3 - t2
      if (change < 0) return best
      deltas.push({ fromTrimester: 2, toTrimester: 3, change })
    }

    if (deltas.length === 0) return best

    const totalChange = deltas.reduce((sum, item) => sum + item.change, 0)
    const averageStepChange = totalChange / deltas.length
    const startTrimester = deltas[0].fromTrimester
    const endTrimester = deltas[deltas.length - 1].toTrimester

    const candidate: ConsistentInfo = {
      student,
      startTrimester,
      endTrimester,
      totalChange,
      averageStepChange,
      stepCount: deltas.length,
    }

    if (!best) return candidate
    if (candidate.averageStepChange < best.averageStepChange) return candidate
    if (candidate.averageStepChange > best.averageStepChange) return best
    if (candidate.totalChange < best.totalChange) return candidate
    if (candidate.totalChange > best.totalChange) return best
    return candidate.stepCount > best.stepCount ? candidate : best
  }, null)
}

export const ConsistentCard = ({ leaderboardData }: ConsistentCardProps) => {
  const mostConsistent = getMostConsistentStudent(leaderboardData)
  const totalStudents = leaderboardData.length

  return (
    <Card className="relative overflow-hidden border-border p-0 bg-card">
      <CardContent className="relative z-10 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-20">
                <Avatar className="size-20 border-2 border-primary">
                  <AvatarImage
                    src={mostConsistent?.student.avatarUrl ?? ""}
                    alt={`${mostConsistent?.student.name ?? "Student"} avatar`}
                  />
                  <AvatarFallback>{getInitials(mostConsistent?.student.name ?? "Student")}</AvatarFallback>
                </Avatar>
                {mostConsistent && (
                  <Badge variant="secondary" className="absolute -bottom-2 -right-2 text-xs font-mono">
                    {mostConsistent.averageStepChange.toFixed(2)} avg
                  </Badge>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold">
                  {mostConsistent?.student.name ?? "No consistent student yet"}
                </p>
                <p className="truncate text-md text-muted-foreground">
                  {mostConsistent?.student.group ?? "No group"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center mt-6 gap-2">
              {mostConsistent ? (
                <>
                  <Badge variant="outline" className="font-mono">
                    Trimester {mostConsistent.startTrimester} to {mostConsistent.endTrimester}
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    +{mostConsistent.totalChange.toFixed(2)} total drift
                  </Badge>
                </>
              ) : (
                <Badge variant="outline" className="font-mono">
                  No steady student found
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {mostConsistent
                ? `Most consistent student out of ${totalStudents} students, with no GPA drops and the smallest average step change.`
                : `No student kept a non-decreasing pace across the available trimesters among ${totalStudents} students.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}