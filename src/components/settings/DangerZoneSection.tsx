import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabaseClient"

export function DangerZoneSection() {
  const navigate = useNavigate()
  const { user } = useUser()

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLeavingLeaderboard, setIsLeavingLeaderboard] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const canDelete = deleteConfirmation === "DELETE"

  const handleLeaveLeaderboard = async () => {
    if (!user) {
      toast.error("You must be signed in to leave the leaderboard")
      return
    }

    try {
      setIsLeavingLeaderboard(true)

      const { error } = await supabase
        .from("transcript_imports")
        .delete()
        .eq("user_id", user.id)

      if (error) throw error

      setLeaveDialogOpen(false)
      navigate("/")
      toast.success("You've left the leaderboard")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to leave leaderboard"
      toast.error(message)
    } finally {
      setIsLeavingLeaderboard(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error("You must be signed in to delete your account")
      return
    }

    try {
      setIsDeletingAccount(true)

      const { error: finalGradesError } = await supabase
        .from("final_grades")
        .delete()
        .eq("user_id", user.id)
      if (finalGradesError) throw finalGradesError

      const { error: calculatorsError } = await supabase
        .from("calculators")
        .delete()
        .eq("user_id", user.id)
      if (calculatorsError) throw calculatorsError

      const { error: transcriptImportsError } = await supabase
        .from("transcript_imports")
        .delete()
        .eq("user_id", user.id)
      if (transcriptImportsError) throw transcriptImportsError

      const { error: profilesError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id)
      if (profilesError) throw profilesError

      const { error: edgeFunctionError } = await supabase.functions.invoke("delete-user", {
        body: { userId: user.id },
      })

      if (edgeFunctionError) {
        throw edgeFunctionError
      }

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      setDeleteDialogOpen(false)
      setDeleteConfirmation("")
      navigate("/")
      toast.success("Account deleted")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete account"
      toast.error(message)
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <Card
      id="danger-zone"
      className="border-destructive/40 bg-destructive/5 shadow-none transition-colors"
    >
      <CardHeader>
        <CardTitle className="text-destructive text-xl">Danger Zone</CardTitle>
        <CardDescription className="text-destructive/80">
          Irreversible actions live here. Please review carefully before continuing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Leave leaderboard</h4>
            <p className="text-muted-foreground text-xs">
              Removes your rank and score history from leaderboard views, while keeping
              your account and saved data.
            </p>
          </div>

          <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="border-destructive/50"
                disabled={isLeavingLeaderboard || isDeletingAccount}
              >
                Leave leaderboard
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove your leaderboard participation and hide your ranking
                  profile. Your account and calculator data will remain intact.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLeavingLeaderboard}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async (event) => {
                    event.preventDefault()
                    await handleLeaveLeaderboard()
                  }}
                  disabled={isLeavingLeaderboard}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isLeavingLeaderboard ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Leaving...
                    </span>
                  ) : (
                    "Confirm leave"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex flex-col gap-3 rounded-md border border-destructive/40 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Delete account</h4>
            <p className="text-muted-foreground text-xs">
              Deletes your account, leaderboard history, and all associated data
              permanently.
            </p>
          </div>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={isDeletingAccount || isLeavingLeaderboard}>
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Type DELETE to confirm permanent
                  deletion.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2">
                <Label htmlFor="delete-confirm-input">Type DELETE to continue</Label>
                <Input
                  id="delete-confirm-input"
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder="DELETE"
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeletingAccount} onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={!canDelete || isDeletingAccount}
                  onClick={async (event) => {
                    event.preventDefault()
                    await handleDeleteAccount()
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeletingAccount ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    "Permanently delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}