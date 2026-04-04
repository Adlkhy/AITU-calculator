import { useState } from "react"

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

export function DangerZoneSection() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const canDelete = deleteConfirmation === "DELETE"

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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" className="border-destructive/50">
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Confirm leave
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
              <Button type="button" variant="destructive">
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
                <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={!canDelete}
                  onClick={() => {
                    setDeleteDialogOpen(false)
                    setDeleteConfirmation("")
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Permanently delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}