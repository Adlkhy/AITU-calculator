import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type PodiumSourceEntry = {
  id: number
  name: string
  group: string
  grade: string
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

function parseProgress(grade: string): number {
  const numeric = Number.parseFloat(grade)
  if (Number.isNaN(numeric)) return 0
  return Math.max(0, Math.min(100, numeric))
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
      progress: parseProgress(item.grade),
    }
  })
}

function accentByRank(rank: PodiumEntry['rank']) {
  if (rank === 1) {
    return {
      badgeClass: 'bg-[#FFD700] text-black border-yellow-500/60',
      ringClass: 'ring-[#FFD700]',
      progressClass: 'bg-[#FFD700]',
      cardClass: 'border-[#FFD700] shadow-yellow-500/10 md:shadow-yellow-500/20',
      pointsClass: 'text-yellow-500',
      heightClass: 'md:min-h-[280px]',
      avatarSize: 'size-20 md:size-24',
      order: 'order-1 md:order-2',
    }
  }

  if (rank === 2) {
    return {
      badgeClass: 'bg-[#C0C0C0] text-black border-gray-500/60',
      ringClass: 'ring-[#C0C0C0]',
      progressClass: 'bg-[#C0C0C0]',
      cardClass: 'border-[#C0C0C0] shadow-gray-500/10',
      pointsClass: 'text-foreground',
      heightClass: 'md:min-h-[240px]',
      avatarSize: 'size-20',
      order: 'order-2 md:order-1',
    }
  }

  return {
    badgeClass: 'bg-[#FF8C00] text-black border-orange-500/60',
    ringClass: 'ring-[#FF8C00]',
    progressClass: 'bg-[#FF8C00]',
    cardClass: 'border-[#FF8C00] shadow-orange-500/10',
    pointsClass: 'text-foreground',
    heightClass: 'md:min-h-[200px]',
    avatarSize: 'size-16 md:size-18',
    order: 'order-3 md:order-3',
  }
}

function HeroPodiumCard({ entry }: { entry: PodiumEntry }) {
  const accent = accentByRank(entry.rank)
  const rankLabel = entry.rank === 1 ? '1st' : entry.rank === 2 ? '2nd' : '3rd'

  return (
    <Card
      className={`w-full md:max-w-sm py-5 text-center backdrop-blur supports-[backdrop-filter]:bg-card/90 transition-all ${accent.cardClass} ${accent.heightClass} ${accent.order}`}
    >
      <CardContent className="flex h-full flex-col items-center justify-center gap-4 px-5">
        <Badge
          className={`border text-[11px] uppercase tracking-[0.12em] ${accent.badgeClass}`}
          variant="outline"
        >
          {rankLabel}
        </Badge>
        <Avatar className={`ring-4 ${accent.avatarSize} ${accent.ringClass}`}>
          <AvatarImage src={entry.avatarUrl} alt={`${entry.name} avatar`} />
          <AvatarFallback>{entry.initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 max-h-16 overflow-hidden">
          <p className="text-base font-semibold leading-tight">{entry.name}</p>
          <p className={`text-sm font-medium ${accent.pointsClass}`}>{entry.group}</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
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
      <div className="relative mx-auto flex max-w-7xl flex-col md:flex-row items-stretch md:items-end justify-center gap-4 md:gap-6 py-5">
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