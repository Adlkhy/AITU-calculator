import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { toPng } from "html-to-image"
import { Star, Diamond, TrendingUp, Zap, ArrowUpCircle, Shield, ArrowUp, Share2, ArrowRight } from "lucide-react"

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

// ─── Radial Progress Ring ─────────────────────────────────────────────────────

function ProgressRing({ percentage, isGold }: { percentage: number; isGold: boolean }) {
  const size = 88
  const strokeWidth = 8
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, percentage)) / 100) * circ

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 transform">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        className="fill-none stroke-white/10"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        className="fill-none drop-shadow-lg"
        stroke={isGold ? "#F5B800" : "#8B5CF6"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
      />
    </svg>
  )
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
        className={`relative w-[420px] bg-[#0C0C13] rounded-[2rem] border ${theme.border} overflow-hidden flex flex-col items-center p-8 z-10 ${isTopThree ? theme.glow : 'shadow-2xl'}`}
      >
        {/* Ambient background glow */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none radial-gradient-glow ${isGold ? 'bg-amber-500/20' : 'bg-violet-500/20'} blur-[100px] rounded-full scale-150 -top-1/2`} />
        
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* 1. RANK */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1 className={`text-7xl font-black tracking-tighter leading-none ${theme.text} drop-shadow-md`}>
              #{rank}
            </h1>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mt-2">
              {isGold ? "Top Performer" : "Leaderboard"}
            </p>
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
            <h2 className="text-xl font-bold text-white tracking-tight">{name}</h2>
            <p className="text-sm text-white/40 mt-1">{group}</p>
          </motion.div>

          {/* 4. STATS GRID */}
          <div className="w-full grid grid-cols-[1fr_1px_1fr] bg-white/[0.03] border border-white/10 rounded-2xl mb-5 overflow-hidden backdrop-blur-sm">
            <div className="p-4 text-center flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">GPA</span>
              <span className={`text-4xl font-black ${theme.text}`}>{gpa.toFixed(2)}</span>
              <span className="text-[10px] text-white/30 mt-1">of 4.0</span>
            </div>
            <div className="bg-white/10" />
            <div className="p-4 flex flex-col items-center justify-center relative">
               <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Average</span>
               <div className="relative w-[88px] h-[88px] flex items-center justify-center">
                 <div className="absolute inset-0">
                    <ProgressRing percentage={percentage} isGold={isGold} />
                 </div>
                 <span className="text-lg font-bold text-white relative z-10">{percentage.toFixed(1)}%</span>
               </div>
            </div>
          </div>

          {/* 5. COMPARISON INSIGHT */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-sm text-emerald-400 font-medium leading-tight">
              {comparison}
              {aboveAvg != null && aboveAvg > 0 && (
                <span className="text-emerald-500/70 font-normal block text-xs mt-0.5">+{aboveAvg}% above class average</span>
              )}
            </p>
          </motion.div>

          {/* 6. ARCHETYPE BADGE */}
          <div className={`inline-flex items-center gap-2 ${theme.bg} border ${theme.border} rounded-full px-4 py-1.5 mb-6`}>
            <ArchetypeIcon badge={archetype} className={`w-3.5 h-3.5 ${theme.text}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>{archetype}</span>
          </div>

          {/* 7. CONTEXT */}
          <p className="text-xs text-white/30 mb-6">
            {semester} · {totalStudents} students
          </p>

          {/* 8. CTA BANNER */}
          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm text-white/50 italic">Can you beat me?</span>
            <span className={`text-xs flex items-center font-bold ${theme.text}`}>evaiis.vercel.app <ArrowRight className="w-4"/></span>
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