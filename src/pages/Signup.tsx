import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SignupForm } from "@/components/signup-form";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      setLoading(false);
      return;
    }

    const maxNameLength = 21;
    if (fullName.length > maxNameLength) {
      toast.warning(`Full name cannot exceed ${maxNameLength} characters`);
      setLoading(false);
      return;
    }

    const uniEmailRegex = /^\d{6}@astanait\.edu\.kz$/;
    if (!uniEmailRegex.test(email)) {
      toast.warning("Please use your university email (ending with @astanait.edu.kz)");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully!");
      navigate("/calculator", { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-8 md:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--card),var(--accent)_38%,var(--background)_72%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_70%)] blur-3xl" />
      <div className="w-full max-w-6xl">
        <Toaster position="top-center" theme="system" />
        <SignupForm 
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          loading={loading}
          onSubmit={handleSignup}
        />
      </div>
    </div>
  )
}