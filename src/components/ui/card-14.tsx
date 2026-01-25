import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeaderboardItem } from "@/pages/Leaderboard";

export const Card_14 = ({ currentUserRank, currentUserAverage, leaderboardData }: { currentUserRank: number; currentUserAverage: string; leaderboardData: LeaderboardItem[] }) => {
  return (
		<div className="relative overflow-hidden rounded-xl bg-white">
			<div
				className="absolute inset-0 rounded-lg"
				style={{
					backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
      `,
				}}
			/>
			<Card className="z-10 isolate bg-transparent border-0">
				<CardHeader>
					<CardTitle className="text-[#0a0a0a] text-xl font-bold">Your Ranking</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[#0a0a0a] mb-2">
              You are ranked <span className="font-bold text-2xl">#{currentUserRank}</span> out of {leaderboardData.length} students
            </p>
            <p className="text-[#0a0a0a]">
              Average Grade: <span className="font-bold text-xl">{currentUserAverage}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-4">
              <div className="text-center text-[#0a0a0a]">
                <div className="text-3xl font-bold">{currentUserRank}</div>
                <div className="text-sm">Rank</div>
              </div>
              <div className="text-center text-[#0a0a0a]">
                <div className="text-3xl font-bold">{currentUserAverage}</div>
                <div className="text-sm">Average</div>
              </div>
            </div>
          </div>
        </CardContent>
			</Card>
		</div>
	);
};
