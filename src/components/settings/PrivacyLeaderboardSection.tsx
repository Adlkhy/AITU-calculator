import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import type { PrivacySettings } from "./types"

type PrivacyLeaderboardSectionProps = {
  value: PrivacySettings
  hasChanges: boolean
  onChange: (nextValue: PrivacySettings) => void
  onSave: () => Promise<void>
}

export function PrivacyLeaderboardSection({
  value,
  hasChanges,
  onChange,
  onSave,
}: PrivacyLeaderboardSectionProps) {
  return (
    <Card id="privacy-leaderboard" className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Privacy & Leaderboard <br /> (In Progress)</CardTitle>
        <CardDescription>
          Decide when and how your performance appears to others.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border/70 p-4">
          <div className="space-y-1">
            <Label htmlFor="participate-leaderboard" className="text-sm font-medium">
              Participate in leaderboard
            </Label>
            <p className="text-muted-foreground text-xs">
              Turn this off to stay hidden from ranking lists.
            </p>
          </div>
          <Switch
            id="participate-leaderboard"
            checked={value.participateInLeaderboard}
            onCheckedChange={(checked) =>
              onChange({ ...value, participateInLeaderboard: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leaderboard-visibility">Leaderboard visibility</Label>
          <Select
            value={value.visibility}
            onValueChange={(nextVisibility) =>
              onChange({
                ...value,
                visibility: nextVisibility as PrivacySettings["visibility"],
              })
            }
          >
            <SelectTrigger id="leaderboard-visibility" className="w-full sm:w-72">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="group">Group only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            Public: visible to everyone. Group only: visible inside your group. Private:
            only visible to you.
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t border-border/70 pt-6">
        <span className="text-muted-foreground text-xs">
          {hasChanges ? "Unsaved changes" : "All changes saved"}
        </span>
        <Button type="button" onClick={onSave} disabled={!hasChanges}>
          Save privacy
        </Button>
      </CardFooter>
    </Card>
  )
}