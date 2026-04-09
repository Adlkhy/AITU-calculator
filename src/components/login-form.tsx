import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import Grainient from "@/components/Grainient"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormProps extends React.ComponentProps<"div"> {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error?: string;
  loading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: (email: string) => void;
}

export function LoginForm({
  className,
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  onForgotPassword,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border bg-card p-0 backdrop-blur-sm">
        <CardContent className="grid min-h-[680px] p-0 md:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-background p-4 md:min-h-full md:p-5">
            <div className="absolute inset-0">
              <Grainient
                color1="#e536ab"
                color2="#5c03bc"
                color3="#0e0725"
                timeSpeed={1}
                colorBalance={0}
                warpStrength={1.5}
                warpFrequency={5}
                warpSpeed={1}
                warpAmplitude={50}
                blendAngle={0}
                blendSoftness={0.05}
                rotationAmount={500}
                noiseScale={2}
                grainAmount={0.1}
                grainScale={2}
                grainAnimated={false}
                contrast={1.5}
                gamma={1}
                saturation={1}
                centerX={0}
                centerY={0}
                zoom={0.6}
                className="h-full w-full"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(13,7,37,0.08)_48%,rgba(5,4,16,0.32)_100%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between rounded-md border border-white/35 p-5 text-white md:p-8">
              <div className="text-5xl font-semibold leading-none tracking-tight text-white/95">*</div>
              <div className="max-w-sm space-y-3">
                <p className="text-sm font-medium text-white/80">You can easily</p>
                <p className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-[2.15rem]">
                 Track every win. <br /> Outrank your class. <br /> See your future grade.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={onSubmit} className="flex items-center justify-center p-6 md:p-10 lg:p-12">
            <div className="w-full max-w-md space-y-8">
              <FieldGroup className="gap-6">
                <div className="space-y-3 text-left md:text-left">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-[2.35rem]">
                    Your rank awaits.
                  </h1>
                  <p className="max-w-sm text-sm leading-5 tracking-tight text-muted-foreground">
                    Log in to check your standing, update your grades, and keep climbing.
                  </p>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <Field>
                  <FieldLabel htmlFor="email">Your email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="123456@astanait.edu.kz"
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      className="ml-auto cursor-pointer text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        onForgotPassword(email);
                      }}
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 rounded-full text-sm shadow-[0_12px_28px_rgba(83,42,255,0.28)]"
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </Field>
                <FieldDescription className="text-center text-sm text-muted-foreground">
                  New here? Your leaderboard journey starts with one <Link to={"/signup"}>click.</Link>
                </FieldDescription>
              </FieldGroup>
            </div>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-sm text-foreground">
        By clicking continue, you agree to our <Link to={"/term-of-service"}>Terms of Service</Link>{" "} or go back to <Link to={"/calculator"}>Home</Link>.
      </FieldDescription>
    </div>
  )
}

export default LoginForm;
