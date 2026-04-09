import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Navbar08 } from "@/components/Navbar"
import { GradeCalculator } from "@/components/GradeCalculator"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { DotLoader } from "@/components/shadcn/gsap/dot-loader"
import { useUser } from "@/hooks/useUser"
import type { SyllabusData } from "@/hooks/types"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"
import { BookOpen, ChevronRight, History } from "lucide-react"

interface Calculator {
  id: string
  course_name: string
  syllabus_data: SyllabusData
  created_at: string
}

const loaderFrames = [
  [14, 7, 0, 8, 6, 13, 20],
  [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28],
  [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42],
  [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38],
  [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14],
  [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27],
  [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20],
  [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10],
  [14, 6, 13, 20, 9, 7, 21],
]

export default function Profile() {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  const [savedCalculators, setSavedCalculators] = useState<Calculator[]>([])
  const [selectedCalc, setSelectedCalc] = useState<Calculator | null>(null)
  const [fetchingCalcs, setFetchingCalcs] = useState(true)

  const fetchUserCalculators = useCallback(async () => {
    if (!user?.id) return

    try {
      setFetchingCalcs(true)
      const { data, error } = await supabase
        .from("calculators")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSavedCalculators(data || [])
    } catch (err) {
      console.error("Error fetching calculators:", err)
    } finally {
      setFetchingCalcs(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true })
      return
    }

    if (user) {
      fetchUserCalculators()
    }
  }, [user, loading, navigate, fetchUserCalculators])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex items-center gap-5 rounded px-4 py-3">
          <DotLoader
            frames={loaderFrames}
            className="gap-0.5"
            color="primary"
            duration={150}
            isPlaying={true}
            dotClassName="bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5"
          />
          <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const profileName = user.user_metadata?.full_name || "User"
  const profileAvatar = user.user_metadata?.avatar_url || "https://github.com/shadcn.png"

  return (
    <>
      <Navbar08 />
      <div className="text-foreground min-h-screen font-sans px-4 sm:px-8 pb-20 max-w-6xl mx-auto">
        <Card className="my-8 bg-card">
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarImage src={profileAvatar} alt={profileName} />
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profileName}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Button onClick={() => navigate("/settings", { replace: true })}>
                Edit profile in settings
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 mt-4 border-t border-border">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-foreground/50">
                  Full Name
                </label>
                <p className="text-foreground font-medium">{profileName || "Not provided"}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-foreground/50">
                  Email
                </label>
                <p className="text-foreground font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-foreground/50">
                  Joined
                </label>
                <p className="text-foreground font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5" /> My Courses
            </h3>
            <div className="space-y-2">
              {fetchingCalcs ? (
                <p className="text-sm text-muted-foreground">Loading courses...</p>
              ) : savedCalculators.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
                  No saved courses yet.
                </div>
              ) : (
                savedCalculators.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => setSelectedCalc(calc)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                      selectedCalc?.id === calc.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-accent border-border"
                    )}
                  >
                    <span className="truncate font-medium">{calc.course_name}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                        selectedCalc?.id === calc.id && "opacity-100"
                      )}
                    />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedCalc ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Active: {selectedCalc.course_name}</h2>
                  <p className="text-xs text-muted-foreground">
                    Saved on {new Date(selectedCalc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <GradeCalculator data={selectedCalc.syllabus_data} />
              </div>
            ) : (
              <Card className="border-dashed border-2 bg-card/30 flex flex-col items-center justify-center p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <CardTitle className="mb-2">No Course Selected</CardTitle>
                <CardDescription className="max-w-xs">
                  Select one of your saved courses from the sidebar to view and edit your
                  grades.
                </CardDescription>
                <Button variant="outline" className="mt-6" onClick={() => navigate("/ai") }>
                  Create New Calculator
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
