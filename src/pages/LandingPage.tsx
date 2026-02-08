
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Card_3 } from '@/components/ui/card-3';
import { Badge } from '@/components/ui/badge';
import { useTheme } from "@/lib/useTheme"
import Plasma from '@/components/shadcn/gsap/Plasma';
import { 
  Trophy, 
  Sparkles, 
  Calculator, 
  Calendar, 
  PieChart, 
  Target, 
  ArrowRight,
  Menu,
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { useUser } from '@/hooks/useUser';
import Footer from '@/components/Footer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GlowEffect } from '@/components/ui/glow-button';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme } = useTheme();

  const features = [
    {
      title: "Smart Grade Calculation",
      description: "Pre-built templates for complex syllabuses. Just plug in your scores and see your final grade.",
      icon: <Calculator className="h-6 w-6 text-primary" />,
    },
    {
      title: "Attendance Tracker",
      description: "Never miss a limit again. Keep track of your absences and know exactly when you need to show up.",
      icon: <Calendar className="h-6 w-6 text-primary" />,
    },
    {
      title: "AI Analysis",
      description: "Get smart insights into your performance. Our Gemini-powered AI helps you strategize your study plan.",
      icon: <Sparkles className="h-6 w-6 text-primary" />,
    },
    {
      title: "Budget Management",
      description: "Manage your student expenses alongside your grades. Perfect for staying on top of your finances.",
      icon: <PieChart className="h-6 w-6 text-primary" />,
    }
  ];

  const topPlayers = [
    { name: "Elon Musk", score: 98.5, rank: 1, avatar: "EM" },
    { name: "Mark Zuckerberg", score: 97.2, rank: 2, avatar: "MZ" },
    { name: "Donald Trump", score: 96.8, rank: 3, avatar: "DT" },
  ];

  const plasmaColor = (theme === 'dark' || theme === 'system') ? "#79c0ff" : "#e2ebff";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="h-5 sm:h-6" />
            {(theme === 'dark' || theme === 'system') ?
              <img src="/white.png" alt="logo" className="h-5 sm:h-6 ms-2 " /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6 ms-2" />
            }
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
              Leaderboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              AI Assistant
            </Button>
            <ModeToggle />
            {user ? (
              <Button size="sm" variant="default" onClick={() => navigate('/calculator')}>Calculator</Button>
            ) : (
              <div className='flex gap-2'>
                <Button size="sm" variant="default" onClick={() => navigate('/login')}>Login</Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/signup')}>Sign Up</Button>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/logo.png" alt="logo" className="h-5 sm:h-6" />
                    {theme === 'dark' || theme === 'system' ?
                      <img src="/white.png" alt="logo" className="h-5 sm:h-6 ms-2 " /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6 ms-2" />
                    }
                  </SheetTitle>
                </SheetHeader>
                <div className="flex px-4 flex-col gap-4">
                  <Button variant="ghost" className="justify-start text-lg" onClick={() => navigate('/leaderboard')}>
                    <Trophy className="mr-2 h-5 w-5" />
                    Leaderboard
                  </Button>
                  <Button variant="ghost" className="justify-start text-lg" onClick={() => navigate('/ai')}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI Assistant
                  </Button>
                  <hr className="my-2 border-border" />
                  {user ? (
                    <Button className="w-full justify-start text-lg" onClick={() => navigate('/calculator')}>
                      Calculator
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button className="w-full justify-start text-lg" onClick={() => navigate('/login')}>
                        Login
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-lg" onClick={() => navigate('/signup')}>
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {/* Hero Section */}
        <div className="absolute inset-0 w-full h-[680px] sm:h-[540px] lg:h-[690px] z-0 pointer-events-none">
            <Plasma 
            color={plasmaColor}
            speed={1}
            direction="forward"
            scale={1}
            opacity={1}
            mouseInteractive={false} 
            />
        </div>
        <section className="relative py-20 z-10 lg:py-32 container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="outline" className="px-4 py-1 text-sm bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/20 font-medium">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
              Now with AI-Powered Insights
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-foreground">
              Master Your Grades with <span className="text-primary">Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Calculate grades, track attendance, manage your budget, and climb the leaderboard. 
              Everything a student needs in one minimal, powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/calculator')}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => navigate('/leaderboard')}>
                View Leaderboard
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="relative z-10 py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Everything You Need</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                No more confusing spreadsheets. Evalis provides the tools you need to stay on top of your academic life.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-primary/80 bg-transparent hover:bg-primary/5 transition-colors">
                  <CardHeader>
                    <div className="mb-2 p-3 w-fit rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard Highlight */}
        <section className="py-20 container mx-auto px-4 text-foreground">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium">
                <Trophy className="h-4 w-4" />
                Live Leaderboard
              </div>
              <h2 className="text-4xl font-bold tracking-tight">Competition Meets Academic Excellence</h2>
              <p className="text-lg text-muted-foreground italic">
                "Healthy competition drives better results. See where you stand among your peers and push your limits."
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/20 p-1 rounded">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Real-time Ranking:</span> See your position update instantly as you log grades.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/20 p-1 rounded">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Earn Badges:</span> Unlock achievements for consistency and excellence.
                  </div>
                </li>
              </ul>
              <Button variant="outline" onClick={() => navigate('/leaderboard')}>
                View Global Rankings
              </Button>
            </div>

            
            <Card_3 topPlayers={topPlayers} user={user} />
          </div>
        </section>

        {/* AI Call to Action */}
        <section className="py-20 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  {/* <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5733] via-[#33FF57] to-[#F1C40F] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div> */}
                  <GlowEffect 
                    colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                    mode='flowHorizontal'
                    blur='softest'
                    duration={3}
                    scale={1}
                    className='absolute -inset-1 rounded-lg blur'
                  />
                  <div className="relative px-6 py-4 bg-background rounded-lg border border-primary/20 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="font-bold text-foreground">Gemini AI Integrated</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Don't just track grades. <br />
                <span className="text-primary italic">Strategize them.</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Our AI analyzes your subjects, attendance, and current scores to give you 
                personalized advice on what to focus on for that next A+.
              </p>
              <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/ai')}>
                Try AI Assistant
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof/Footer CTA */}
        <section className="py-20 container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground border-none shadow-2xl relative overflow-hidden">
             {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <CardContent className="p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to take control of your semester?</h2>
                <p className="text-primary-foreground/80 text-lg">
                  Join hundreds of students already tracking their path to success.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Button variant="secondary" size="lg" className="h-12 px-8" onClick={() => navigate('/signup')}>
                  Get Started Now
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-foreground" onClick={() => navigate('/calculator')}>
                  Go to Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
