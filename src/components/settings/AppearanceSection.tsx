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

import type { AppearanceSettings } from "./types"

type AppearanceSectionProps = {
  value: AppearanceSettings
  hasChanges: boolean
  onChange: (nextValue: AppearanceSettings) => void
  onSave: () => void
}

export function AppearanceSection({
  value,
  hasChanges,
  onChange,
  onSave,
}: AppearanceSectionProps) {
  return (
    <Card id="appearance" className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Appearance</CardTitle>
        <CardDescription>
          Pick how Evalis looks on this device.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Label htmlFor="appearance-theme">Theme</Label>
        <Select
          value={value.theme}
          onValueChange={(nextTheme) =>
            onChange({
              ...value,
              theme: nextTheme as AppearanceSettings["theme"],
            })
          }
        >
          <SelectTrigger id="appearance-theme" className="w-full sm:w-60">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          System follows your operating system preference.
        </p>
      </CardContent>

      <CardFooter className="justify-between border-t border-border/70 pt-6">
        <span className="text-muted-foreground text-xs">
          {hasChanges ? "Unsaved changes" : "All changes saved"}
        </span>
        <Button type="button" onClick={onSave} disabled={!hasChanges}>
          Save appearance
        </Button>
      </CardFooter>
    </Card>
  )
}