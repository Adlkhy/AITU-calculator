import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // This is critical — Supabase sets the session from the URL token
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Session is now active, user can set new password
        console.log('Recovery session active:', session);
      }
    });
  }, []);

  const handleReset = async () => {
    setError(undefined);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
      console.error('Error updating password:', error);
    } else {
      toast.success('Password updated!');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-sm md:max-w-xl">
        <Toaster position="top-center" theme="system" />
        <div className="flex flex-col gap-3">
          <Card className="overflow-hidden p-0">
            <CardContent className="">
              <form onSubmit={handleReset} className="p-4 md:p-6">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Enter your new password below.
                    </p>
                    { error && (
                      <p className="text-sm text-red-600">{error}</p>
                    ) }
                  </div>
                    <Field>
                      <Field className="">
                        <Field>
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <Input
                            id="password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </Field>
                      </Field>
                      <FieldDescription>
                        Must be at least 8 characters long.
                      </FieldDescription>
                    </Field>
                    <Field>
                      <Button variant="secondary" size="default" className='w-20' type="submit">
                        Update Password
                      </Button>
                    </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}