import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { toPng } from "html-to-image"
import { Star, Diamond, TrendingUp, Zap, ArrowUpCircle, Shield, ArrowUp, Share2, ArrowRight, GraduationCap } from "lucide-react"
import { ChartContainer, type ChartConfig } from "./ui/chart"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

// ─── Types ───────────────────────────────────────────────────────────────────

export type ArchetypeBadge =
  | "Top Performer"
  | "Elite Scholar"
  | "Rising Star"
  | "Fast Climber"
  | "Strong Contender"
  | "Survivor"

export type ShareCardProps = {
  name: string
  rank: number
  gpa: number
  percentage: number
  group: string
  semester?: string
  totalStudents: number
  avatarUrl?: string
  badge?: ArchetypeBadge
  comparisonText?: string
  classAverage?: number
  onExport?: () => void
}

const chartConfig = {
  grade: {
    label: "Average",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
}

function getArchetype(rank: number, total: number): ArchetypeBadge {
  const pct = rank / total
  if (rank === 1) return "Top Performer"
  if (rank <= 3) return "Elite Scholar"
  if (pct <= 0.1) return "Rising Star"
  if (pct <= 0.25) return "Fast Climber"
  if (pct <= 0.5) return "Strong Contender"
  return "Survivor"
}

const ArchetypeIcon = ({ badge, className }: { badge: ArchetypeBadge; className?: string }) => {
  const icons = {
    "Top Performer": <Star className={className} />,
    "Elite Scholar": <Diamond className={className} />,
    "Rising Star": <TrendingUp className={className} />,
    "Fast Climber": <Zap className={className} />,
    "Strong Contender": <ArrowUpCircle className={className} />,
    "Survivor": <Shield className={className} />,
  }
  return icons[badge]
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ShareCard({
  name,
  rank,
  gpa,
  percentage,
  group,
  semester,
  totalStudents,
  avatarUrl,
  badge,
  comparisonText,
  classAverage,
  onExport,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const isGold = rank === 1
  const isTopThree = rank <= 3
  const archetype = badge ?? getArchetype(rank, totalStudents)
  
  const betterThan = Math.max(1, Math.round(((totalStudents - rank) / totalStudents) * 100))
  const aboveAvg = classAverage != null && percentage > classAverage
      ? Math.round(((percentage - classAverage) / classAverage) * 100)
      : null
      
  const comparison = comparisonText ?? `Better than ${betterThan}% of students`

  // Tailwind Theme Variables based on Rank
  const theme = {
    text: isGold ? "text-amber-400" : "text-violet-500",
    bg: isGold ? "bg-amber-400/10" : "bg-violet-500/10",
    border: isGold ? "border-amber-400/30" : "border-violet-500/30",
    glow: isGold ? "shadow-[0_0_60px_rgba(245,184,0,0.3)]" : "shadow-[0_0_60px_rgba(139,92,246,0.3)]",
    ringGradient: isGold ? "from-amber-400 via-orange-500 to-amber-400" : "from-violet-500 via-pink-500 to-violet-500",
    buttonBg: isGold ? "bg-amber-400 text-black hover:bg-amber-500" : "bg-violet-600 text-white hover:bg-violet-700"
  }

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return
    try {
      // html-to-image handles standard CSS and SVGs much better than html2canvas
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High-res export
        skipFonts: false,
      })
      const link = document.createElement('a')
      link.download = `evaiis-rank-${rank}.png`
      link.href = dataUrl
      link.click()
      onExport?.()
    } catch (err) {
      console.error("Failed to export image", err)
    }
  }, [rank, onExport])

  return (
    <div className="flex flex-col items-center gap-6 font-sans">
      {/* ── CARD TO EXPORT ── */}
      <div
        ref={cardRef}
        className={`relative bg-card rounded-md border ${theme.border} overflow-hidden flex flex-col items-center p-8 z-10 ${isTopThree ? theme.glow : 'shadow-2xl'}`}
      >
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* 1. RANK */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1 className={`text-5xl font-black font-mono tracking-tighter leading-none ${theme.text} drop-shadow-md`}>
              #{rank}
            </h1>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground mt-2">
              Leaderboard
            </p>
            <div className={`mt-4 inline-flex items-center gap-2 ${theme.bg} border ${theme.border} rounded-full px-4 py-1.5`}>
            <ArchetypeIcon badge={archetype} className={`w-3.5 h-3.5 ${theme.text}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>{archetype}</span>
          </div>
          </motion.div>

          {/* 2. AVATAR */}
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-4">
            <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${theme.ringGradient} animate-[spin_4s_linear_infinite] ${isTopThree ? 'opacity-100' : 'opacity-50'}`} />
            <div className="absolute -inset-0.5 rounded-full bg-[#0C0C13]" />
            <div className={`relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center ${theme.bg}`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className={`text-2xl font-black ${theme.text}`}>{getInitials(name)}</span>
              )}
            </div>
          </motion.div>

          {/* 3. NAME + GROUP */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground tracking-tight">{name}</h2>
            <p className="text-sm text-muted-foreground font-mono mt-1">{group}</p>
          </motion.div>

          {/* 4. STATS GRID */}
          <div className="w-full flex flex-col mb-2 overflow-hidden">
            <div className="bg-secondary rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-accent-foreground flex items-center justify-center text-tertiary">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Grade Point Average</p>
                    <h3 className="text-2xl font-extrabold tracking-tight font-mono">{gpa.toFixed(2)} <span className="text-base font-normal">/ 4.0</span></h3>
                  </div>
                </div>
            </div>
            <div className="p-4 flex flex-col items-center justify-center relative">
               <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Average</span>
               <ChartContainer config={chartConfig} className="w-[240px] h-[160px] aspect-square">
                <RadialBarChart
                  data={[{ average: percentage }]}
                  startAngle={90}
                  endAngle={90 + (percentage / 100) * 360}
                  innerRadius={45}
                  outerRadius={62}
                >
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                fill="#F8FAFC"
                                fontSize={18}
                                fontWeight={700}
                              >
                                {`${percentage.toFixed(1)}%`}
                              </tspan>
                            </text>
                          )
                        }
                        return null
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar dataKey="average" cornerRadius={8} fill={isGold ? "#F5B800" : "#8B5CF6"} background />
                </RadialBarChart>
              </ChartContainer>
            </div>
          </div>

          {/* 5. COMPARISON INSIGHT */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ArrowUp className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-sm text-emerald-400 font-medium leading-tight">
              {comparison}
              {aboveAvg != null && aboveAvg > 0 && (
                <span className="text-emerald-500/70 font-normal block text-xs mt-0.5">+{aboveAvg}% above class average</span>
              )}
            </p>
          </motion.div>

          {/* 7. CONTEXT */}
          <p className="text-xs text-muted-foreground mb-6">
            {semester} · {totalStudents} students
          </p>

          {/* 8. CTA BANNER */}
          <div className="w-full bg-card border border-border rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground italic">Where u at?</span>
            <span className={`text-xs flex items-center font-bold ${theme.text}`}><ArrowRight className="w-4"/> evaiis.vercel.app</span>
          </div>

        </div>
      </div>

      {/* ── EXPORT BUTTON ── */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        className={`px-8 py-3 rounded-xl font-bold text-base flex items-center gap-2 transition-all shadow-lg ${theme.buttonBg}`}
      >
        <Share2 />Share
      </motion.button>
    </div>
  )
}

export default ShareCard