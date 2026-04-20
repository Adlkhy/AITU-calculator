import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useLeaderboardData } from "@/hooks/useLeaderboardData"

type FastestClimberCardProps = {
  leaderboardData: ReturnType<typeof useLeaderboardData>["leaderboardData"]
}

type LeaderboardItem = ReturnType<typeof useLeaderboardData>["leaderboardData"][number]

type ClimbInfo = {
  student: LeaderboardItem
  fromTrimester: 1 | 2
  toTrimester: 2 | 3
  fromRank: number
  toRank: number
  rankGain: number
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function buildTrimesterRankMap(data: LeaderboardItem[], trimester: 1 | 2 | 3): Map<string, number> {
  return new Map(
    data
      .map((student) => ({
        student,
        gpa: student.gpaByTrimester[`trimester${trimester}`],
      }))
      .filter((entry): entry is { student: LeaderboardItem; gpa: number } => typeof entry.gpa === "number")
      .sort((left, right) => right.gpa - left.gpa)
      .map((entry, index) => [entry.student.userId, index + 1])
  )
}

function getFastestClimber(data: LeaderboardItem[]): ClimbInfo | null {
  const trimester1Ranks = buildTrimesterRankMap(data, 1)
  const trimester2Ranks = buildTrimesterRankMap(data, 2)
  const trimester3Ranks = buildTrimesterRankMap(data, 3)

  return data.reduce<ClimbInfo | null>((best, student) => {
    const candidates: Array<{
      fromTrimester: 1 | 2
      toTrimester: 2 | 3
      fromRank: number | undefined
      toRank: number | undefined
    }> = [
      {
        fromTrimester: 1,
        toTrimester: 2,
        fromRank: trimester1Ranks.get(student.userId),
        toRank: trimester2Ranks.get(student.userId),
      },
      {
        fromTrimester: 2,
        toTrimester: 3,
        fromRank: trimester2Ranks.get(student.userId),
        toRank: trimester3Ranks.get(student.userId),
      },
    ]

    const improvements = candidates
      .filter((entry) => entry.fromRank !== undefined && entry.toRank !== undefined && entry.toRank < entry.fromRank)
      .map((entry) => ({
        fromTrimester: entry.fromTrimester,
        toTrimester: entry.toTrimester,
        fromRank: entry.fromRank as number,
        toRank: entry.toRank as number,
        rankGain: (entry.fromRank as number) - (entry.toRank as number),
      }))

    if (improvements.length === 0) {
      return best
    }

    const studentBest = improvements.reduce((max, current) =>
      current.rankGain > max.rankGain ? current : max
    )

    if (!best || studentBest.rankGain > best.rankGain) {
      return {
        student,
        fromTrimester: studentBest.fromTrimester,
        toTrimester: studentBest.toTrimester,
        fromRank: studentBest.fromRank,
        toRank: studentBest.toRank,
        rankGain: studentBest.rankGain,
      }
    }

    return best
  }, null)
}

export const FastestClimberCard = ({ leaderboardData }: FastestClimberCardProps) => {
  const fastestClimber = getFastestClimber(leaderboardData)
  const totalStudents = leaderboardData.length

  return (
    <Card className="relative overflow-hidden border-border p-0 bg-[#ADF7B6]">
      <CardContent className="relative z-10 p-4 sm:p-5">
      <CardHeader className="p-0">
        <h3 className="text-lg font-semibold text-black">Fastest Climber</h3>
      </CardHeader>
      
        <div className="">
          <div className="space-y-4 flex items-start justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative w-18 sm:w-20">
                <Avatar className="size-14 sm:size-16 border-2 border-primary">
                  <AvatarImage
                    src={fastestClimber?.student.avatarUrl ?? ""}
                    alt={`${fastestClimber?.student.name ?? "Student"} avatar`}
                  />
                  <AvatarFallback>{getInitials(fastestClimber?.student.name ?? "Student")}</AvatarFallback>
                </Avatar>
                {fastestClimber && (
                  <Badge variant="secondary" className="absolute -bottom-2 -right-2 text-[10px] sm:text-xs font-mono">
                    +{fastestClimber.rankGain} ranks
                  </Badge>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-black text-sm sm:text-base font-semibold">
                  {fastestClimber?.student.name ?? "No climber yet"}
                </p>
                <p className="truncate text-black text-xs sm:text-sm">
                  {fastestClimber?.student.group ?? "No group"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {fastestClimber ? (
                <>
                  <Badge variant="outline" className="text-[10px] text-black border-black md:text-sm font-mono">
                    Rank {fastestClimber.fromRank} to {fastestClimber.toRank}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] text-black border-black md:text-sm font-mono">
                    Trimester {fastestClimber.fromTrimester} to {fastestClimber.toTrimester}
                  </Badge>
                </>
              ) : (
                <Badge variant="outline" className="text-[10px] text-black border-black md:text-sm font-mono">
                  No positive rank climb
                </Badge>
              )}
            </div>

          </div>
            <p className="text-sm text-black">
              {fastestClimber
                ? `Fastest climber out of ${totalStudents} students, based on the biggest rank jump between adjacent trimesters.`
                : `No student improved their rank from one trimester to the next among ${totalStudents} students.`}
            </p>
        </div>
      </CardContent>
    </Card>
  )
}