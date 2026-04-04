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

const initialMockSettings: SettingsData = {
	publicProfile: {
		name: "Adil Khan",
		avatarUrl: "https://github.com/shadcn.png",
		bio: "CS student focused on consistent grades and clean study systems.",
		socialLinks: ["https://github.com/adilkhan", "https://t.me/adilkhan"],
		group: "CS-SST-24",
	},
	account: {
		email: "adil.khan@evalis.app",
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

export default function Settings() {
	const { setTheme } = useTheme()
	const { user } = useUser()
	const [settings, setSettings] = useState<SettingsData>(initialMockSettings)
	const [savedSettings, setSavedSettings] = useState<SettingsData>(initialMockSettings)
	const [activeSection, setActiveSection] = useState<SettingsSectionKey>("public-profile")
	const [savingProfile, setSavingProfile] = useState(false)

  const { leaderboardData } = useLeaderboardData(null, null, null)
  const currentUserData = leaderboardData.find((u) => u.isCurrentUser)
  const group = currentUserData?.group || "No group"

	useEffect(() => {
		if (!user) return

		const socialLinksFromMetadata = Array.isArray(user.user_metadata?.social_links)
			? (user.user_metadata.social_links as string[])
			: []

		const singleSocialLink =
			typeof user.user_metadata?.social_link === "string"
				? user.user_metadata.social_link
				: ""

		const resolvedSocialLinks =
			socialLinksFromMetadata.length > 0
				? socialLinksFromMetadata
				: singleSocialLink
					? [singleSocialLink]
					: [""]

		const hydratedSettings: SettingsData = {
			...initialMockSettings,
			publicProfile: {
				...initialMockSettings.publicProfile,
				name: user.user_metadata?.full_name ?? "",
				avatarUrl:
					user.user_metadata?.avatar_url ?? initialMockSettings.publicProfile.avatarUrl,
				socialLinks: resolvedSocialLinks,
				group: user.user_metadata?.group ?? initialMockSettings.publicProfile.group,
			},
			account: {
				email: user.email ?? initialMockSettings.account.email,
			},
		}

		setSettings(hydratedSettings)
		setSavedSettings(hydratedSettings)
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

									const sanitizedLinks = settings.publicProfile.socialLinks
										.map((link) => link.trim())
										.filter(Boolean)

									const primarySocialLink = sanitizedLinks[0] ?? ""

									const { error: userUpdateError } = await supabase.auth.updateUser({
										data: {
											full_name: settings.publicProfile.name,
											avatar_url: settings.publicProfile.avatarUrl,
											social_link: primarySocialLink,
											social_links: sanitizedLinks,
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
											socialLinks:
												sanitizedLinks.length > 0 ? sanitizedLinks : [""],
										},
									}))

									setSavedSettings((prevSaved) => ({
										...prevSaved,
										publicProfile: {
											...settings.publicProfile,
											socialLinks:
												sanitizedLinks.length > 0 ? sanitizedLinks : [""],
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
							onSave={() =>
								setSavedSettings((prevSaved) => ({
									...prevSaved,
									privacy: settings.privacy,
								}))
							}
						/>

						<DangerZoneSection />
					</div>
				</div>
			</div>
		</main>
    </>
	)
}
