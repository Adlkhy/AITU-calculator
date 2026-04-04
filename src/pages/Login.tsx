import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      navigate("/calculator", { replace: true });
    }
    setLoading(false);
  };

  const handleForgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) setError(error.message);
  else toast.success('Check your email for the reset link!');
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Toaster position="top-center" theme="system" />
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </div>
  )
}
