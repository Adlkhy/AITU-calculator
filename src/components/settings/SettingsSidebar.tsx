import {
  AlertTriangle,
  Lock,
  Palette,
  Trophy,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import type { SettingsSectionKey } from "./types"

type SidebarItem = {
  key: SettingsSectionKey
  label: string
  icon: React.ComponentType<{ className?: string }>
  danger?: boolean
}

const items: SidebarItem[] = [
  { key: "public-profile", label: "Public Profile", icon: UserRound },
  { key: "account", label: "Account", icon: Lock },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "privacy-leaderboard", label: "Privacy & Leaderboard", icon: Trophy, },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
]

type SettingsSidebarProps = {
  activeSection: SettingsSectionKey
  onSectionChange: (section: SettingsSectionKey) => void
}

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <>
      <div className="md:hidden">
        <Select
          value={activeSection}
          onValueChange={(value) => onSectionChange(value as SettingsSectionKey)}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Jump to section" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <aside className="hidden md:block">
        <nav className="sticky top-20 w-60 space-y-1 pr-4">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <Button
                key={item.key}
                variant="ghost"
                className={cn(
                  "h-9 w-full justify-start rounded-md px-3 text-sm font-medium transition-colors",
                  activeSection === item.key
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  item.danger && "mt-4"
                )}
                onClick={() => onSectionChange(item.key)}
              >
                <Icon
                  className={cn(
                    "mr-2 size-4",
                    item.danger ? "text-destructive" : "text-muted-foreground"
                  )}
                />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}