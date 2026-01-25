import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface Player {
  rank: number;
  avatar: string;
  name: string;
  score: number;
}

interface Card3Props {
  topPlayers: Player[];
  user: unknown;
}

export const Card_3 = ({ topPlayers, user }: Card3Props) => {
  
  return (
		<div className="p-2 border-[0.5px] rounded-lg border-border">
			<Card
				className={cn(
					"border-[1.5px] bg-linear-to-br rounded-lg shadow-xl border-primary/10 bg-card overflow-hidden",
					// light mode
					"from-background to-muted/60 shadow-[2px_0_8px_rgba(0,0,0,0.15)]",
					// dark mode
					"dark:from-background dark:via-foreground/5 dark:to-background dark:shadow-inner",
				)}
			>
				<CardHeader className="bg-primary/5 py-2">
          <CardTitle className="text-lg flex justify-between items-center text-foreground">
            Weekly Top Performers
              <Badge variant="secondary">Global</Badge>
            </CardTitle>
          </CardHeader>
				<CardContent className="p-0">
          <div className="divide-y divide-border">
            {topPlayers.map((player) => (
              <div key={player.rank} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-bold w-6 ${
                    player.rank === 1 ? 'text-yellow-500' : 
                    player.rank === 2 ? 'text-slate-400' : 
                    'text-amber-600'
                  }`}>
                    {player.rank}
                  </span>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {player.avatar}
                  </div>
                  <span className="font-medium text-foreground">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground">{player.score}%</div>
                  <div className="text-xs text-muted-foreground">GPA Index</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-muted/30 text-center">
            <span className="text-sm text-muted-foreground italic">Join {user ? 'thousands of' : 'more'} students already tracking their progress</span>
          </div>
        </CardContent>
			</Card>
		</div>
	);
};
