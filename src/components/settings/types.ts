import type { Theme } from "@/lib/theme-context"

export type SettingsSectionKey =
  | "public-profile"
  | "account"
  | "appearance"
  | "privacy-leaderboard"
  | "danger-zone"

export type LeaderboardVisibility = "public" | "group" | "private"

export type PublicProfileSettings = {
  name: string
  avatarUrl: string
  bio: string
  socialLinks: string[]
  group: string
}

export type AccountSettings = {
  email: string
}

export type AppearanceSettings = {
  theme: Extract<Theme, "light" | "dark" | "custom" | "system">
}

export type PrivacySettings = {
  participateInLeaderboard: boolean
  visibility: LeaderboardVisibility
  showStatsPublicly: boolean
}

export type SettingsData = {
  publicProfile: PublicProfileSettings
  account: AccountSettings
  appearance: AppearanceSettings
  privacy: PrivacySettings
}