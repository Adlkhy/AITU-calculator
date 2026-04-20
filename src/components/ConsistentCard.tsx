import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    <Card className="relative overflow-hidden border-border p-0 bg-[#A0CED9]">
      <CardContent className="relative z-10 p-4 sm:p-5">
      <CardHeader className="p-0">
        <h3 className="text-lg font-semibold text-black">Most Consistent Student</h3>
      </CardHeader>
      
        <div className="">
          <div className="space-y-4 flex items-start justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative w-18 sm:w-20">
                <Avatar className="size-14 sm:size-16 border-2 border-primary">
                  <AvatarImage
                    src={mostConsistent?.student.avatarUrl ?? ""}
                    alt={`${mostConsistent?.student.name ?? "Student"} avatar`}
                  />
                  <AvatarFallback>{getInitials(mostConsistent?.student.name ?? "Student")}</AvatarFallback>
                </Avatar>
                {mostConsistent && (
                  <Badge variant="secondary" className="absolute -bottom-2 -right-2 text-[10px] sm:text-xs font-mono">
                    {mostConsistent.averageStepChange.toFixed(2)} avg
                  </Badge>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-black text-sm sm:text-base font-semibold">
                  {mostConsistent?.student.name ?? "No consistent student yet"}
                </p>
                <p className="truncate text-black text-xs sm:text-sm">
                  {mostConsistent?.student.group ?? "No group"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {mostConsistent ? (
                <>
                  <Badge variant="outline" className="text-[10px] text-black border-black md:text-sm font-mono">
                    Trimester {mostConsistent.startTrimester} to {mostConsistent.endTrimester}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] text-black border-black md:text-sm font-mono">
                    +{mostConsistent.totalChange.toFixed(2)} total drift
                  </Badge>
                </>
              ) : (
                <Badge variant="outline" className="text-[10px] text-black border-black md:text-sm font-mono">
                  No steady student found
                </Badge>
              )}
            </div>

          </div>
            <p className="text-sm text-black">
              {mostConsistent
                ? `Most consistent student out of ${totalStudents} students, with no GPA drops and the smallest average step change.`
                : `No student kept a non-decreasing pace across the available trimesters among ${totalStudents} students.`}
            </p>
        </div>
      </CardContent>
    </Card>
  )
}