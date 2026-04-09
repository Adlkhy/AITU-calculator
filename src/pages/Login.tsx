import { useEffect, useState } from "react";
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

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email to reset password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent. Check your inbox.");
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-8 md:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--card),var(--accent)_38%,var(--background)_72%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_70%)] blur-3xl" />
      <div className="w-full max-w-6xl">
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
