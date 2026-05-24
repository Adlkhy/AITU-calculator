import { useEffect, useMemo, useState } from "react"
import { Navbar08 } from "@/components/Navbar"
import { AccountSection } from "@/components/settings/AccountSection"
import { AppearanceSection } from "@/components/settings/AppearanceSection"
import { DangerZoneSection } from "@/components/settings/DangerZoneSection"
import { PrivacyLeaderboardSection } from "@/components/settings/PrivacyLeaderboardSection"
import { PublicProfileSection } from "@/components/settings/PublicProfileSection"
import { SettingsSidebar } from "@/components/settings/SettingsSidebar"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabaseClient"
import type { SettingsData, SettingsSectionKey } from "@/components/settings/types"
import { useTheme } from "@/lib/useTheme"
import { useLeaderboardData } from "@/hooks/useLeaderboardData"
import { SeoMeta } from '@/lib/seo'

const defaultSettings: SettingsData = {
	publicProfile: {
		name: "",
		avatarUrl: "https://i.pinimg.com/736x/57/e2/5c/57e25c3c048bfa751bc767282ee02087.jpg",
		bio: "",
		group: "",
	},
	account: {
		email: "",
	},
	appearance: {
		theme: "dark",
	},
	privacy: {
		participateInLeaderboard: true,
		visibility: "group",
		showStatsPublicly: false,
	},
}

function isDifferent<T>(current: T, saved: T) {
	return JSON.stringify(current) !== JSON.stringify(saved)
}

type DbPrivacy = {
	participate?: boolean
	visibility?: "public" | "group" | "private"
	show_stats?: boolean
}

function normalizePrivacyFromDb(value: unknown): SettingsData["privacy"] {
	const maybePrivacy = (value && typeof value === "object" ? value : {}) as DbPrivacy

	return {
		participateInLeaderboard: maybePrivacy.participate ?? true,
		visibility:
			maybePrivacy.visibility === "public" ||
			maybePrivacy.visibility === "group" ||
			maybePrivacy.visibility === "private"
				? maybePrivacy.visibility
				: "group",
		showStatsPublicly: maybePrivacy.show_stats ?? false,
	}
}

export default function Settings() {
	const { setTheme } = useTheme()
	const { user } = useUser()
	const [settings, setSettings] = useState<SettingsData>(defaultSettings)
	const [savedSettings, setSavedSettings] = useState<SettingsData>(defaultSettings)
	const [activeSection, setActiveSection] = useState<SettingsSectionKey>("public-profile")
	const [savingProfile, setSavingProfile] = useState(false)

  const { leaderboardData } = useLeaderboardData(null, null, null)
  const currentUserData = leaderboardData.find((u) => u.isCurrentUser)
  const group = currentUserData?.group || "No group"

	useEffect(() => {
		if (!user) return

		let isCancelled = false

		const hydrateSettings = async () => {

		const hydratedSettings: SettingsData = {
			...defaultSettings,
			publicProfile: {
				...defaultSettings.publicProfile,
				name: user.user_metadata?.full_name ?? "",
				avatarUrl:
					user.user_metadata?.avatar_url ?? defaultSettings.publicProfile.avatarUrl,
				group: user.user_metadata?.group ?? defaultSettings.publicProfile.group,
			},
			account: {
				email: user.email ?? defaultSettings.account.email,
			},
		}

		try {
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("privacy")
				.eq("id", user.id)
				.single()

			if (!profileError && profileData?.privacy) {
				hydratedSettings.privacy = normalizePrivacyFromDb(profileData.privacy)
			}
		} catch (error) {
			console.error("Error hydrating privacy settings:", error)
		}

		if (isCancelled) return

		setSettings(hydratedSettings)
		setSavedSettings(hydratedSettings)
		}

		hydrateSettings()

		return () => {
			isCancelled = true
		}
	}, [user])

	const sectionHasChanges = useMemo(
		() => ({
			publicProfile: isDifferent(settings.publicProfile, savedSettings.publicProfile),
			appearance: isDifferent(settings.appearance, savedSettings.appearance),
			privacy: isDifferent(settings.privacy, savedSettings.privacy),
		}),
		[savedSettings, settings]
	)

	const scrollToSection = (section: SettingsSectionKey) => {
		setActiveSection(section)
		const target = document.getElementById(section)
		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" })
		}
	}

	return (
    <>
		<SeoMeta
			title="Settings | Evalis"
			description="Adjust your Evalis appearance, privacy, and account settings."
			path="/settings"
			noindex
		/>
    <Navbar08 />
		<main className="min-h-screen bg-background py-6 text-foreground sm:py-10">
			<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
				<header className="mb-6 space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
					<p className="text-muted-foreground text-sm">
						Manage your profile, privacy controls, and account preferences.
					</p>
				</header>

				<div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
					<SettingsSidebar
						activeSection={activeSection}
						onSectionChange={(section) => {
							scrollToSection(section)
						}}
					/>

					<div className="w-full max-w-[800px] space-y-6">
						<PublicProfileSection
							value={settings.publicProfile}
              group={group}
							hasChanges={sectionHasChanges.publicProfile}
							onChange={(nextValue) =>
								setSettings((prevSettings) => ({
									...prevSettings,
									publicProfile: nextValue,
								}))
							}
							onSave={async () => {
								if (!user?.id || savingProfile) return

								try {
									setSavingProfile(true)

									const { error: userUpdateError } = await supabase.auth.updateUser({
										data: {
											full_name: settings.publicProfile.name,
											avatar_url: settings.publicProfile.avatarUrl,
										},
									})

									if (userUpdateError) throw userUpdateError

									const { error: profileUpdateError } = await supabase
										.from("profiles")
										.update({
											full_name: settings.publicProfile.name,
											avatar_url: settings.publicProfile.avatarUrl,
										})
										.eq("id", user.id)

									if (profileUpdateError) throw profileUpdateError

									setSettings((prevSettings) => ({
										...prevSettings,
										publicProfile: {
											...prevSettings.publicProfile,
										},
									}))

									setSavedSettings((prevSaved) => ({
										...prevSaved,
										publicProfile: {
											...settings.publicProfile,
										},
									}))
								} catch (error) {
									console.error("Error updating profile:", error)
									alert("Error updating profile")
								} finally {
									setSavingProfile(false)
								}
							}}
						/>

						<AccountSection email={settings.account.email} />

						<AppearanceSection
							value={settings.appearance}
							hasChanges={sectionHasChanges.appearance}
							onChange={(nextValue) =>
								setSettings((prevSettings) => ({
									...prevSettings,
									appearance: nextValue,
								}))
							}
							onSave={() => {
								setTheme(settings.appearance.theme)
								setSavedSettings((prevSaved) => ({
									...prevSaved,
									appearance: settings.appearance,
								}))
							}}
						/>

						<PrivacyLeaderboardSection
							value={settings.privacy}
							hasChanges={sectionHasChanges.privacy}
							onChange={(nextValue) =>
								setSettings((prevSettings) => ({
									...prevSettings,
									privacy: nextValue,
								}))
							}
							onSave={async () => {
								if (user?.id) {
									const { error: privacyUpdateError } = await supabase
										.from("profiles")
										.update({
											privacy: {
												participate: settings.privacy.participateInLeaderboard,
												visibility: settings.privacy.visibility,
												show_stats: settings.privacy.showStatsPublicly,
											},
										})
										.eq("id", user.id)

									if (privacyUpdateError) throw privacyUpdateError
								}

								setSavedSettings((prevSaved) => ({
									...prevSaved,
									privacy: settings.privacy,
								}))
							}}
						/>

						<DangerZoneSection />
					</div>
				</div>
			</div>
		</main>
    </>
	)
}
