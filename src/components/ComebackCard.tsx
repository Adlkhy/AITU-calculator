import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useLeaderboardData } from "@/hooks/useLeaderboardData"

type ComebackCardProps = {
  leaderboardData: ReturnType<typeof useLeaderboardData>["leaderboardData"]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

type ComebackInfo = {
  student: ReturnType<typeof useLeaderboardData>["leaderboardData"][number]
  improvement: number
  fromTrimester: 1 | 2
  toTrimester: 2 | 3
}

function getBestComeback(
  data: ReturnType<typeof useLeaderboardData>["leaderboardData"]
): ComebackInfo | null {
  return data.reduce<ComebackInfo | null>((best, student) => {
    const t1 = student.gpaByTrimester.trimester1
    const t2 = student.gpaByTrimester.trimester2
    const t3 = student.gpaByTrimester.trimester3

    const deltas: Array<{
      improvement: number
      fromTrimester: 1 | 2
      toTrimester: 2 | 3
    }> = []

    if (t1 !== null && t2 !== null && t2 > t1) {
      deltas.push({ improvement: t2 - t1, fromTrimester: 1, toTrimester: 2 })
    }

    if (t2 !== null && t3 !== null && t3 > t2) {
      deltas.push({ improvement: t3 - t2, fromTrimester: 2, toTrimester: 3 })
    }

    if (deltas.length === 0) {
      return best
    }

    const studentBestDelta = deltas.reduce((max, current) =>
      current.improvement > max.improvement ? current : max
    )

    if (!best || studentBestDelta.improvement > best.improvement) {
      return {
        student,
        improvement: studentBestDelta.improvement,
        fromTrimester: studentBestDelta.fromTrimester,
        toTrimester: studentBestDelta.toTrimester,
      }
    }

    return best
  }, null)
}

export const ComebackCard = ({ leaderboardData }: ComebackCardProps) => {
  const bestComeback = getBestComeback(leaderboardData)
  const totalStudents = leaderboardData.length

  return (
    <Card className="relative overflow-hidden border-border p-0">
      <CardContent className="relative z-10 p-4 sm:p-5 bg-[#FFEE93]">
        <CardHeader className="p-0">
          <h3 className="text-lg font-semibold text-black">Most Comebacked Student</h3>
        </CardHeader>
        
        <div className="">
          <div className="space-y-4 flex items-start justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative w-18 sm:w-20">
              <Avatar className="size-14 sm:size-16 border-2 border-primary">
                <AvatarImage src={bestComeback?.student.avatarUrl ?? ""} alt={`${bestComeback?.student.name ?? "Student"} avatar`} />
                <AvatarFallback>{getInitials(bestComeback?.student.name ?? "Student")}</AvatarFallback>
              </Avatar>
              {bestComeback && (
                <Badge variant="secondary" className="absolute -bottom-2 -right-0 text-[10px] sm:text-xs font-mono">
                  +{bestComeback.improvement.toFixed(2)}
                </Badge>
              )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-black sm:text-base font-semibold">{bestComeback?.student.name ?? "No comeback yet"}</p>
                <p className="truncate text-xs text-black sm:text-sm">{bestComeback?.student.group ?? "No group"}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {bestComeback ? (
                <>
                  <Badge variant="outline" className="text-[10px] text-black md:text-sm font-mono">
                    {bestComeback.student.gpaByTrimester[`trimester${bestComeback.toTrimester}`]!.toFixed(2)}/4.0 now
                  </Badge>
                  <Badge variant="outline" className="text-[10px] text-black md:text-sm font-mono">
                    Trimester {bestComeback.fromTrimester} to {bestComeback.toTrimester}
                  </Badge>
                </>
              ) : (
                <Badge variant="outline" className="text-[10px] text-black border-black md:text-sm font-mono">No positive trimester increase</Badge>
              )}
            </div>

          </div>
            <p className="text-sm text-black">
              {bestComeback
                ? `Most comebacked student out of ${totalStudents} students, counting only GPA increases.`
                : `No student has a positive jump from trimester 1 to 2 or 2 to 3 among ${totalStudents} students.`}
            </p>
        </div>
      </CardContent>
    </Card>
  )
}
