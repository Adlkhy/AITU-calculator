import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type PodiumSourceEntry = {
  id: number
  name: string
  group: string
  grade: number
  avatarUrl?: string
}

type PodiumEntry = {
  rank: 1 | 2 | 3
  name: string
  group: string
  avatarUrl: string
  initials: string
  progress: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function calculateGPAtoPercentage(grade: number): number {
  // Assuming GPA is on a 4.0 scale, convert to percentage
  return Math.max(0, Math.min(100, (grade / 4.0) * 100));
}

function createPodiumEntries(data: PodiumSourceEntry[]): PodiumEntry[] {
  const topThree = [...data]
    .sort((a, b) => a.id - b.id)
    .filter((item) => item.id <= 3)

  return topThree.map((item) => {
    const rank = (item.id === 1 ? 1 : item.id === 2 ? 2 : 3) as 1 | 2 | 3
    return {
      rank,
      name: item.name,
      group: item.group,
      avatarUrl: item.avatarUrl ?? '',
      initials: getInitials(item.name),
      progress: calculateGPAtoPercentage(item.grade),
    }
  })
}

function accentByRank(rank: PodiumEntry['rank']) {
  if (rank === 1) {
    return {
      badgeClass: 'bg-[#FFD700] text-black border-yellow-500/60',
      bg: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 215, 36, 0.25), transparent 70%)',
      ringClass: 'ring-[#FFD700]',
      progressClass: 'bg-[#FFD700]',
      cardClass: 'border-[#FFD700] shadow-yellow-500/10 md:shadow-yellow-500/20',
      pointsClass: 'text-yellow-500',
      heightClass: 'min-h-[200px] sm:min-h-[240px] md:min-h-[280px]',
      avatarSize: 'size-16 sm:size-18 md:size-24',
      order: 'order-2',
    }
  }

  if (rank === 2) {
    return {
      badgeClass: 'bg-[#C0C0C0] text-black border-gray-500/60',
      bg: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192, 192, 192, 0.25), transparent 70%)',
      ringClass: 'ring-[#C0C0C0]',
      progressClass: 'bg-[#C0C0C0]',
      cardClass: 'border-[#C0C0C0] shadow-gray-500/10',
      pointsClass: 'text-foreground',
      heightClass: 'min-h-[180px] sm:min-h-[210px] md:min-h-[240px]',
      avatarSize: 'size-14 sm:size-16 md:size-20',
      order: 'order-3',
    }
  }

  return {
    badgeClass: 'bg-[#FF8C00] text-black border-orange-500/60',
    bg: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 140, 0, 0.25), transparent 70%)',
    ringClass: 'ring-[#FF8C00]',
    progressClass: 'bg-[#FF8C00]',
    cardClass: 'border-[#FF8C00] shadow-orange-500/10',
    pointsClass: 'text-foreground',
    heightClass: 'min-h-[160px] sm:min-h-[180px] md:min-h-[200px]',
    avatarSize: 'size-12 sm:size-14 md:size-18',
    order: 'order-1',
  }
}

function HeroPodiumCard({ entry }: { entry: PodiumEntry }) {
  const accent = accentByRank(entry.rank)
  const rankLabel = entry.rank === 1 ? '1st' : entry.rank === 2 ? '2nd' : '3rd'

  return (
    <Card
      style={{
        background: `${accent.bg}, var(--background)`,
      }}
      className={`flex flex-col min-w-0 flex-1 basis-0 py-3 text-center backdrop-blur supports-[backdrop-filter]:bg-card/90 transition-all sm:py-4 md:max-w-sm md:py-5 ${accent.cardClass} ${accent.heightClass} ${accent.order}`}
    >
      <CardContent className="flex flex-1 flex-col items-center justify-between gap-2 px-2 sm:gap-3 sm:px-4 md:gap-4 md:px-5">
        
        <Badge
          className={`border text-[9px] uppercase tracking-[0.1em] sm:text-[11px] sm:tracking-[0.12em] ${accent.badgeClass}`}
          variant="outline"
        >
          {rankLabel}
        </Badge>

        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="relative mt-2 sm:mt-3 md:mt-5">
            {entry.rank === 1 && (
              <img src='/crown.png' alt="Place crown" className="absolute z-20 -top-9 w-16 sm:-top-11 sm:w-16 md:-top-14 md:w-24" />
            )}
            <Avatar className={`ring-4 ${accent.avatarSize} ${accent.ringClass}`}>
              <AvatarImage src={entry.avatarUrl} alt={`${entry.name} avatar`} />
              <AvatarFallback>{entry.initials}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="max-h-14 space-y-0.5 overflow-hidden sm:max-h-16 sm:space-y-1">
            <p className="text-[11px] font-semibold leading-tight sm:text-sm md:text-base">{entry.name}</p>
            <p className={`text-[10px] font-medium sm:text-xs md:text-sm ${accent.pointsClass}`}>{entry.group}</p>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted mt-auto">
          <div className={`h-full rounded-full ${accent.progressClass}`} style={{ width: `${entry.progress}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}

export function HeroPodium({ data }: { data: PodiumSourceEntry[] }): React.ReactNode {
  const podiumEntries = createPodiumEntries(data)

  return (
    <section className="relative px-4 lg:px-6" data-purpose="hero-podium">
      <div className="relative mx-auto flex max-w-7xl flex-row flex-nowrap items-end justify-center gap-2 overflow-hidden py-5 sm:gap-3 md:gap-6">
        {podiumEntries.map((entry) => (
          <HeroPodiumCard key={entry.rank} entry={entry} />
        ))}
      </div>
    </section>
  )
}

export function Podium({ data }: { data: PodiumSourceEntry[] }): React.ReactNode {
  return <HeroPodium data={data} />
}