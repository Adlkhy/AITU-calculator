import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import type { PublicProfileSettings } from "./types"

type PublicProfileSectionProps = {
  value: PublicProfileSettings
  hasChanges: boolean
  onChange: (nextValue: PublicProfileSettings) => void
  onSave: () => void
  group: string
}

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/dylan/svg?seed=Wyatt&backgroundColor=619eff,ffd5dc,b6e3f4,c0aede&mood=confused,happy,hopeful,neutral,superHappy',
  'https://api.dicebear.com/9.x/dylan/svg?seed=Sadie&backgroundColor=619eff,ffd5dc,b6e3f4,c0aede&mood=confused,happy,hopeful,neutral,superHappy',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,c0aede&facialHairProbability=10&mood=confused,happy,hopeful,superHappy,neutral&seed=Eliza',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,c0aede&facialHairProbability=10&mood=confused,happy,hopeful,superHappy,neutral&seed=Aidan',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Atlas',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Nova',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Orion',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Pixel',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Zen',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Leo',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Kai',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Atlas',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Orion',
  'https://api.dicebear.com/9.x/dylan/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Zane',

  'https://api.dicebear.com/9.x/big-smile/svg?seed=Brian&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
  'https://api.dicebear.com/9.x/big-smile/svg?seed=Mason&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
  'https://api.dicebear.com/9.x/big-smile/svg?seed=Luis&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
  'https://api.dicebear.com/9.x/big-smile/svg?seed=Sara&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&eyes=cheery,normal,sleepy,starstruck,confused&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Alex',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Nova',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Pixel',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Orbit',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=confused,happy,hopeful,neutral,superHappy&seed=Rocket',
  'https://api.dicebear.com/9.x/big-smile/svg?accessories=catEars,glasses,mustache,sleepMask,sunglasses&hair=bowlCutHair,braids,bunHair,curlyBob,curlyShortHair,froBun,halfShavedHead,mohawk,shortHair,straightHair,wavyBob,bangs&backgroundColor=c0aede,b6e3f4,ffd5dc,ffdfbf,d1d4f9&seed=Easton',
  'https://api.dicebear.com/9.x/big-smile/svg?accessories=catEars,glasses,mustache,sleepMask,sunglasses&hair=bowlCutHair,braids,bunHair,curlyBob,curlyShortHair,froBun,halfShavedHead,mohawk,shortHair,straightHair,wavyBob,bangs&backgroundColor=c0aede,b6e3f4,ffd5dc,ffdfbf,d1d4f9&seed=Brian',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Echo',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Luna',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Cosmo',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Sunny',
  'https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=29e051,619eff,ffa6e6,b6e3f4,c0aede,d1d4f9&mood=happy,hopeful,neutral,superHappy&seed=Rocket',
];

export function PublicProfileSection({
  value,
  hasChanges,
  onChange,
  onSave,
  group,
}: PublicProfileSectionProps) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  const updateSocialLink = (index: number, nextLink: string) => {
    const next = [...value.socialLinks]
    next[index] = nextLink
    onChange({ ...value, socialLinks: next })
  }

  const addSocialLink = () => {
    onChange({ ...value, socialLinks: [...value.socialLinks, ""] })
  }

  const removeSocialLink = (index: number) => {
    if (value.socialLinks.length === 1) {
      onChange({ ...value, socialLinks: [""] })
      return
    }

    const next = value.socialLinks.filter((_, itemIndex) => itemIndex !== index)
    onChange({ ...value, socialLinks: next })
  }

  return (
    <Card id="public-profile" className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Public Profile</CardTitle>
        <CardDescription>
          Update your visible profile details used across Evalis.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-3 flex flex-col items-center">
            <Label>Avatar</Label>
            <Avatar className="size-20 sm:size-28 border border-border/70">
              <AvatarImage src={value.avatarUrl} alt={value.name} />
              <AvatarFallback>{value.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-24"
              onClick={() => setShowAvatarPicker((prev) => !prev)}
            >
              {showAvatarPicker ? "Close" : "Edit"}
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="public-name">Name</Label>
            <Input
              id="public-name"
              value={value.name}
              onChange={(event) => onChange({ ...value, name: event.target.value })}
              placeholder="Your display name"
            />
            <p className="text-muted-foreground text-xs">
              Your name appears on profile cards and leaderboard entries.
            </p>
          </div>

        </div>

        {showAvatarPicker && (
          <div className="space-y-3 rounded-lg border border-border/70 p-4">
            <Label>Select profile picture</Label>
            <div className="flex flex-wrap gap-3">
              {AVATAR_OPTIONS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => onChange({ ...value, avatarUrl: url })}
                  className={cn(
                    "rounded-full border-2 p-1 transition-all",
                    value.avatarUrl === url
                      ? "border-primary scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Avatar className="size-12 sm:size-14">
                    <AvatarImage src={url} alt="Avatar option" />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Social links</Label>
            <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
              <Plus className="size-4" />
              Add link
            </Button>
          </div>
          <div className="space-y-2">
            {value.socialLinks.map((link, index) => (
              <div key={`social-${index}`} className="flex gap-2">
                <Input
                  value={link}
                  onChange={(event) => updateSocialLink(index, event.target.value)}
                  placeholder="https://github.com/username"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialLink(index)}
                  aria-label="Remove social link"
                  className="hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="public-group">Group</Label>
          <Input id="public-group" value={group} readOnly className="bg-muted/40" />
          <p className="text-muted-foreground text-xs">
            Group is managed by your institution and cannot be edited here.
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t border-border/70 pt-6">
        <span className="text-muted-foreground text-xs">
          {hasChanges ? "Unsaved changes" : "All changes saved"}
        </span>
        <Button type="button" onClick={onSave} disabled={!hasChanges}>
          Save profile
        </Button>
      </CardFooter>
    </Card>
  )
}