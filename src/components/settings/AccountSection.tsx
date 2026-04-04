import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AccountSectionProps = {
  email: string
}

export function AccountSection({ email }: AccountSectionProps) {
  return (
    <Card id="account" className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Account</CardTitle>
        <CardDescription>Manage access and account identity settings.</CardDescription>
        <CardAction>
          <Button asChild variant="outline" size="sm">
            <Link to="/profile">Go to profile</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="account-email">Email</Label>
          <Input id="account-email" value={email} readOnly className="bg-muted/40" />
          <p className="text-muted-foreground text-xs">
            Email is managed through authentication and cannot be edited here.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline">
            Change password
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}