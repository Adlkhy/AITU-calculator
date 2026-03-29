import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';
import { ModeToggle } from '@/components/mode-toggle';
import { useTheme } from "@/lib/useTheme";
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, 
  Sparkles, ArrowRight, 
  Check,
  Palette,
  Rocket,
  Code,
  Calculator,
  ScanFace,
  BadgeDollarSign,
  ChartLine,
  GraduationCap,
  Trophy,
  ArrowUpRight,} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Features', href: '#features' },
  { label: 'AI', href: '#ai' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'FAQ', href: '#faq' },
];

const features1 = [
  'Pre-built templates',
  'Budget management',
  'Grade forecasting',
];

const subjects = [
  { name: 'Calculus', link: '/calculator/calculus' },
  { name: 'Programming C++', link: '/calculator/cpp' },
  { name: "Programming Python", link: '/calculator/python' },
  { name: "English", link: '/calculator/english' },
  { name: "German", link: '/calculator/german' },
  { name: "Chinese", link: '/calculator/chinese' },
  { name: "Korean", link: '/calculator/korean' },
  { name: "Sociology", link: '/calculator/sociology' },
  { name: "Discrete Math", link: '/calculator/discrete-math' },
  { name: "Psychology", link: '/calculator/psychology' },
  { name: "ICT", link: '/calculator/ict' },
  { name: "Calculus 1", link: '/calculator/calculus-1' },
  { name: "Calculus 2", link: '/calculator/calculus-2' },
  { name: "Physics", link: '/calculator/physics' },
  { name: "Physical Education", link: '/calculator/physical-education' },
  { name: "History", link: '/calculator/history' },
  { name: "Intro to Computing and Programming", link: '/calculator/intro-to-computing-and-programming' },
  { name: "Linear Algebra", link: '/calculator/linear-algebra' },
  { name: "Political Science", link: '/calculator/political-science' },
  { name: "Culture Studies", link: '/calculator/culture-studies' },
  { name: "Foundations of Journalism", link: '/calculator/foundations-of-journalism' },
  { name: "Business Administration", link: '/calculator/business-administration' },
  { name: "Mathematics for AI", link: '/calculator/mathematics-for-ai' },
  { name: 'Calculus', link: '/calculator/calculus' },
  { name: 'Programming C++', link: '/calculator/cpp' },
  { name: "Programming Python", link: '/calculator/python' },
  { name: "English", link: '/calculator/english' },
  { name: "German", link: '/calculator/german' },
  { name: "Chinese", link: '/calculator/chinese' },
  { name: "Korean", link: '/calculator/korean' },
  { name: "Sociology", link: '/calculator/sociology' },
  { name: "Discrete Math", link: '/calculator/discrete-math' },
  { name: "Psychology", link: '/calculator/psychology' },
  { name: "ICT", link: '/calculator/ict' },
  { name: "Calculus 1", link: '/calculator/calculus-1' },
  { name: "Calculus 2", link: '/calculator/calculus-2' },
  { name: "Physics", link: '/calculator/physics' },
  { name: "Physical Education", link: '/calculator/physical-education' },
  { name: "History", link: '/calculator/history' },
  { name: "Intro to Computing and Programming", link: '/calculator/intro-to-computing-and-programming' },
  { name: "Linear Algebra", link: '/calculator/linear-algebra' },
  { name: "Political Science", link: '/calculator/political-science' },
  { name: "Culture Studies", link: '/calculator/culture-studies' },
  { name: "Foundations of Journalism", link: '/calculator/foundations-of-journalism' },
  { name: "Business Administration", link: '/calculator/business-administration' },
  { name: "Mathematics for AI", link: '/calculator/mathematics-for-ai' },
];

const testimonials = [
  {
  id: 1,
  name: 'Mark Zuckerberg',
  handle: '@zuck',
  avatar: 'https://image.cnbcfm.com/api/v1/image/108043097-1727989387071-gettyimages-2173579179-META_CONNECT.jpeg?v=1744292077&w=800&h=600&ffmt=webp',
  content: 'Evalis feels like a well-designed system — clean, data-driven, and actually useful. The grade prediction and GPA tracking turn academic progress into something measurable and motivating.',
},
{
  id: 2,
  name: 'Joker',
  handle: '@joker',
  avatar: 'https://i.guim.co.uk/img/media/fbb1974c1ebbb6bf4c4beae0bb3d9cb93901953c/80_0_2400_1440/master/2400.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=ede2b27f1cea7c3be30b938195c0cc5c',
  content: 'Why so serious about grades? Predicting exam points, battling friends on leaderboards… it’s like turning stress into a game. I don’t know if it saved my GPA — but it definitely saved my sanity.',
},
{
  id: 3,
  name: 'Lady Yaya',
  handle: '@yaya',
  avatar: 'https://i.scdn.co/image/ab67616100005174aadc18cac8d48124357c38e6',
  content: 'Evalis is honestly a lifesaver. Everything is organized, aesthetic, and easy to understand. Finally, a tool that understands students.',
},
{
  id: 4,
  name: 'Baddie',
  handle: '@baddest',
  avatar: 'https://static.vecteezy.com/system/resources/thumbnails/000/265/417/small/cartoon-funny-comic-hand-finger-pointing.jpg',
  content: 'Evalis is that girl. GPA tracking, attendance, budget management, AND competition with friends? I stayed disciplined, on track, and lowkey obsessed.',
},
{
  id: 5,
  name: 'Sam Sung',
  handle: '@sam',
  avatar: 'https://i.insider.com/68f7fed2cc993f9955d0a15e?width=500&format=jpeg&auto=webp',
  content: 'Evalis just works. Smooth, reliable, and packed with features. The exam point prediction helped me plan my finals properly, and the budget tracker was an unexpected bonus.',
},
{
  id: 6,
  name: 'P. Ennis',
  handle: '@ennis',
  avatar: 'https://img-9gag-fun.9cache.com/photo/aLQN9Az_460s.jpg',
  content: 'Evalis helped me understand where I stand academically without overthinking it. Clear numbers, realistic predictions, and practical tools. It’s not flashy — it’s effective.',
},
{
  id: 7,
  name: 'Pablo Escobar',
  handle: '@pablo',
  avatar: 'https://wamu.org/wp-content/uploads/2016/09/01/narcos_203_00873r1_wide-775f1c1b8a3fe57cb17da8361e5e1c165e90d12f-1500x844.jpg',
  content: 'Time is money. Evalis saved me both. I knew exactly how many points I needed, and how to manage my budget. Control the system before it controls you.',
},
{
  id: 8,
  name: 'BroCode',
  handle: '@bro',
  avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mPFVsxROj1dOtTWc9iNBwDYV4z42Q8LPokBSewiW9pCSg=s900-c-k-c0x00ffffff-no-rj',
  content: 'Evalis is goated. You compete with your friends, and still know how hard you need to grind before finals. Studying alone is boring — this makes it a challenge.',
},
{
  id: 9,
  name: 'Arthur Morgan',
  handle: '@arthur',
  avatar: 'https://i.ytimg.com/vi/Jjt8KLHuJ6A/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAUAh53OYKpdi_SUT-ayLcfWNKWvg',
  content: 'I ain’t much for fancy tools, but Evalis keeps things honest. Shows you where you stand, what you need to do, and gives you a fair shot at finishing strong. Simple, clear, and dependable.',
},
{
  id: 10,
  name: 'Bread Pitt',
  handle: '@bread',
  avatar: 'https://ih1.redbubble.net/image.4621930181.9872/raf,360x360,075,t,fafafa:ca443f4786.jpg',
  content: 'Evalis makes studying look good. Clean interface, smart predictions, and surprisingly fun features. The leaderboard kept me motivated, and the AI templates saved me hours. Five stars.',
},
];

const features = [
  {
    icon: Calculator,
    title: 'Grade Calculator',
    url: '/calculator',
    description:
      'Calculate your current grade, predict final marks, and set goals with our intuitive grade calculator.',
  },
  {
    icon: ScanFace,
    title: 'Attendance Tracker',
    url: '/calculator/attendance',
    description:
      'Track your attendance and calculate how many classes you can miss without dropping below a passing grade.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Budget Manager',
    url: '/calculator/budget',
    description:
      'Track your expenses and income to manage your budget effectively.',
  },
  {
    icon: Sparkles,
    title: 'AI Template Maker',
    url: '/ai',
    description:
      'Upload your syllabus and let our AI extract key info to create a personalized study template in seconds.',
    },
  {
    icon: ChartLine,
    title: 'Leadership Boards',
    url: '/leaderboard',
    description:
      'Compete with friends and classmates on our public leaderboards. See how you stack up in your school or globally.',
    },
  {
    icon: GraduationCap,
    title: 'GPA Insights',
    url: '/calculator/gpa',
    description:
      'Get detailed insights into your GPA, including projections and what-if scenarios to help you plan your academic future.',
  },
];

const aiFeatures = [
  { icon: Check, label: 'Image Upload' },
  { icon: Check, label: 'Gemini AI' },
  { icon: Check, label: 'Image-to-Template' },
  { icon: Check, label: 'Template Preview' },
];

const steps = [
  {
    number: '01',
    icon: Palette,
    title: 'Enter',
    description:
      'Use pre-built templates or create your own. Calculate grades, budget, attandance, and more. See changes in real-time.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Code,
    title: 'Analyze',
    description:
      'Our smart calculators instantly process the numbers, showing you projections, trends, and what-if scenarios.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Improve',
    description:
      'Use your new insights to set goals, adjust your study habits, or manage your finances for a better trimester.',
    color: 'from-orange-500 to-red-500',
  },
];

const faqs = [
  {
    question: 'How accurate is the grade prediction?',
    answer:
      'It is as accurate as the data you provide. By inputting all your current assignments and their weights, the final mark predictor gives you a precise target to aim for.',
  },
  {
    question: 'Is my data private on the leaderboards?',
    answer:
      'Absolutely. You control your privacy. You can choose to appear anonymously or use a nickname.',
  },
  {
    question: "What kind of syllabus files does the AI tool accept?",
    answer:
      'The AI Template Maker works best with screenshot of subject plan from PDFs. It extracts key information to build your study guide in seconds.',
  },
  {
    question: 'Are there pre-built templates for different subjects?',
    answer:
      'I built them myself, so if I don\'t have a template for a specific subject, you can create your own or request one.',
  },
  {
    question: 'Do I need to login to use the calculator?',
    answer:
      'No login is required to use the grade calculator. However, creating an account allows you to save your data and access it across devices, and allows you to participate in leaderboards.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

function ThemeCard({ theme }: { theme: { name: string; link: string; }; onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => navigate(theme.link)}
      className="flex items-center px-4 py-2.5 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
    >
      <span className="text-sm font-medium text-foreground whitespace-nowrap group-hover:text-primary transition-colors">
        {theme.name}
      </span>
    </motion.button>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: {
    id: number;
    name: string;
    handle: string;
    avatar: string;
    content: string;
  };
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex-shrink-0 w-[350px] p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
            <p className="text-muted-foreground text-xs">{testimonial.handle}</p>
          </div>
        </div>
      </div>
      <p className="text-foreground text-base whitespace-pre-line leading-relaxed">
        {testimonial.content}
      </p>
    </motion.div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const row1 = testimonials.slice(0, 5);
  const row2 = testimonials.slice(5);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center mx-auto justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="flex items-center gap-2">
              {(theme === 'dark' || theme === 'system') ?
                <img src="/evalis-black.png" alt="logo" className="h-5 sm:h-6" /> : <img src="/evalis-white.png" alt="logo" className="h-5 sm:h-6" />
              }
              <span className='sm:px-2'>|</span>
              {(theme === 'dark' || theme === 'system') ?
                <img src="/white.png" alt="logo" className="h-5 sm:h-6" /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6" />
              }
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-around gap-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className="nav-link px-4 text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* GitHub Stars */}
              {/* <motion.a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              >
                <Github className="w-4 h-4" />
                <span>9.4k</span>
              </motion.a> */}

              {/* Toggle Theme Button */}
              <ModeToggle />

              {/* Try It Now Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="hidden sm:block"
              >
                <Button
                  asChild
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-4"
                  onClick={() => navigate('/calculator')}
                >
                  <div className="cursor-pointer flex items-center gap-1">
                    Try It Now
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </div>
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-b border-border p-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="pt-2"
                >
                  <Button className="cursor-pointer w-full bg-foreground text-background hover:bg-foreground/90 rounded-full" onClick={() => { navigate('/calculator'); setIsMobileMenuOpen(false); }}>
                    Try It Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 pb-32 md:pt-32 md:pb-40 overflow-hidden grid-pattern">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 67%, transparent 100%)',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6"
          >
            Master Your Grades with
            <span className="mx-2 relative inline-block">
              <span className="relative z-10 italic font-serif font-medium">Confidence & </span>
            </span>
              Precision
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl text-muted-foreground max-w-xs sm:max-w-2xl mx-auto mb-8"
          >
            Calculate grades, manage your budget, and climb the leaderboard. 
            Everything a student needs in one minimal, powerful platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button
              asChild
              variant="default"
              size="default"
              onClick={() => navigate('/calculator')}
              className="bg-foreground text-background hover:bg-foreground/90 px-8! h-11! rounded-full text-base group"
            >
              <div className="flex font-medium items-center gap-1 cursor-pointer">
                Start Calculating
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="default"
              onClick={() => navigate('/leaderboard')}
              className="bg-background text-foreground rounded-full px-8! h-11! text-base border-border hover:text-primary hover:bg-accent"
            >
              <div className='cursor-pointer'>Leaderboards</div>
            </Button>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {features1.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Theme Presets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 relative"
        >
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling rows */}
          <div className="space-y-3 overflow-hidden">
            {/* Row 1 - Left to Right */}
            <div className="relative">
              <motion.div
                className="flex gap-4 animate-marquee"
                style={{ width: 'fit-content' }}
              >
                {[...subjects.slice(0, 12), ...subjects.slice(0, 12)].map((subject, index) => (
                  <ThemeCard key={`row1-${index}`} theme={subject} />
                ))}
              </motion.div>
            </div>
            
            {/* Row 2 - Right to Left */}
            <div className="relative">
              <motion.div
                className="flex gap-4 animate-marquee-reverse"
                style={{ width: 'fit-content' }}
              >
                {[...subjects.slice(12, 24), ...subjects.slice(12, 24)].map((subject, index) => (
                  <ThemeCard key={`row2-${index}`} theme={subject} />
                ))}
              </motion.div>
            </div>
            
            {/* Row 3 - Left to Right */}
            <div className="relative mb-2">
              <motion.div
                className="flex gap-4 animate-marquee"
                style={{ width: 'fit-content' }}
              >
                {[...subjects.slice(24), ...subjects.slice(24)].map((subject, index) => (
                  <ThemeCard key={`row3-${index}`} theme={subject} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Testimonials */}
    <section id="testimonials" className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 text-center px-4 sm:px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl tracking-tight font-bold text-foreground mb-4">
            Loved by <span className="text-primary italic">Students</span>
          </h2>
          <p className="text-muted-foreground max-w-[600px] text-base md:text-xl">
            See what people are saying about Evalis
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="max-w-7xl mx-auto relative px-4 md:px-6">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-28 md:w-52 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 md:w-52 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Row 1 - Left to Right */}
        <div className=" overflow-hidden py-1.5">
          <motion.div
            className="flex gap-4 animate-marquee"
            style={{ width: 'fit-content' }}
          >
            {[...row1, ...row1].map((testimonial, index) => (
              <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="overflow-hidden py-1.5">
          <motion.div
            className="flex gap-4 animate-marquee-reverse"
            style={{ width: 'fit-content' }}
          >
            {[...row2, ...row2].map((testimonial, index) => (
              <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="py-20 md:py-32 w-full relative">
      <div className="max-w-7xl grid gap-12 lg:grid-cols-[1fr_2fr] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center space-y-4"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-left font-bold text-foreground tracking-tight mb-2">
            Powerful Tools <br className=''/>
          <span className="text-muted-foreground">
            For Total Control
          </span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-[400px]">
            Everything you need to master your grades and stay on top of your academic game.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.1 } }}
              className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(feature.url)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                  <span className="text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-6 h-6" />
                  </span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Ai Section */}
    <section id='ai' className="bg-muted/35 w-full relative py-24 md:py-32 lg:py-40 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-accent/20 pointer-events-none" />
    {/* Violet Storm Background with Top Glow */}
    {/* <div
      className="absolute inset-0 z-0"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
      }}
    /> */}
          <div className="max-w-7xl relative z-10 mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Generate templates in 
                <span className="block italic text-primary">Seconds</span>
              </h1>
              <p className="max-w-xl text-base md:text-xl text-muted-foreground">
                Just upload an image of syllabus and our AI will generate a personalized grade calculator template based on your course structure.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                asChild
                size="default"
                variant="outline"
                className="hover:text-primary rounded-full px-8! h-10! text-lg group"
                onClick={() => navigate('/ai')}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  Generate with AI
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Button>
              </div>
              {/* AI Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 pt-4 gap-4">
                {aiFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-muted-foreground flex items-center gap-3 text-base rounded-lg border bg-card px-2 py-2 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors">
                      <feature.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <span className="group-hover:text-foreground transition-colors">
                      {feature.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="rounded-2xl border bg-card/80 p-4 shadow-lg backdrop-blur"
            >
              <div className="mb-4 flex items-center justify-between border-b pb-3">
                <p className="text-sm font-medium">Subject</p>
                <Badge>AI</Badge>
              </div>
              <div className="grid gap-4">
                <Button className="w-full justify-between">
                    Generate
                    <Sparkles className="h-4 w-4" />
                </Button>
                <div className="rounded-xl border bg-background p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="h-3 w-3 rounded-full bg-accent" />
                    <div className="h-3 w-3 rounded-full bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-2/3 rounded bg-foreground/15" />
                    <div className="h-2 w-1/2 rounded bg-foreground/10" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm">Save to Profile</Button>
                    <Button size="sm" variant="outline">Dismiss</Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Card className="bg-primary/15 py-3">
                    <CardContent className="">
                      <p className="text-xs text-muted-foreground">Midterm</p>
                      <p className="mt-1 font-semibold">30%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-accent py-3">
                    <CardContent className="">
                      <p className="text-xs text-muted-foreground">Endterm</p>
                      <p className="mt-1 font-semibold">30%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted py-3">
                    <CardContent className="">
                      <p className="text-xs text-muted-foreground">Final</p>
                      <p className="mt-1 font-semibold">40%</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 rounded-md bg-primary/15" />
                  <div className="h-8 rounded-md bg-accent" />
                  <div className="h-8 rounded-md bg-muted" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
    </section>

    {/* Leaderboard Section */}
    <section id="leaderboard" className="relative w-full py-32 md:py-44 bg-background overflow-hidden">
      {/* Background: faint horizontal rule stripes for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent, transparent 79px, hsl(var(--border)) 80px)",
          opacity: 0.35,
        }}
      />

    {/* Midnight Mist */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 100%, color-mix(in oklab, var(--foreground) 20%, transparent) 0%, transparent 60%), radial-gradient(circle at 50% 100%, color-mix(in oklab, var(--primary) 26%, transparent) 0%, transparent 70%), radial-gradient(circle at 50% 100%, color-mix(in oklab, var(--muted-foreground) 14%, transparent) 0%, transparent 80%)',
      }}
    />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center space-y-5 mb-14"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-2xl mx-auto">
            Your rank is waiting.
            <br />
            <span className="text-muted-foreground font-semibold">Will you claim it?</span>
          </h2>
      
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Every grade you log moves you up the global rankings. See where you stand against your peers.
          </p>
      
          <Button
            className="rounded-full px-8 h-11 text-sm mt-2 hover:text-primary group"
            variant="outline"
            onClick={() => navigate("/leaderboard")}
          >
            Open Leaderboard
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-2xl border bg-card shadow-2xl overflow-hidden"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-4 px-5 py-3.5 border-b bg-muted/40 backdrop-blur">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 bg-background/70 rounded-md px-3 py-1 text-xs text-muted-foreground border w-52 sm:w-64 justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shrink-0" />
                evaiis.vercel.app/leaderboard
              </div>
            </div>
            <div className="w-16" /> 
          </div>
      
          <div className="flex items-center justify-between px-6 pt-6 pb-3">
            <div>
              <p className="text-base font-semibold">Global Rankings</p>
              <p className="text-xs text-muted-foreground mt-0.5">Updated just now · 1273 students</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Live
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs rounded-lg">
                All time
              </Button>
            </div>
          </div>
      
          <div className="grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2.5rem_1fr_140px_auto] items-center gap-4 px-6 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
            <span className="text-center">#</span>
            <span>Student</span>
            <span className="hidden sm:block text-right">Score trend</span>
            <span className="text-right">GPA</span>
          </div>
      
          <div className="px-3 pb-4 space-y-1">
            {[
              { rank: 1, name: "Sam Sung",    avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=Brian&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4", gpa: "3.98", trend: 92, delta: "+0.04", top: true },
              { rank: 2, name: "Shay Kitoff",   avatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Sadie&backgroundColor=619eff,ffd5dc,b6e3f4,c0aede&mood=confused,happy,hopeful,neutral,sad,superHappy", gpa: "3.90", trend: 78, delta: "+0.02", top: false },
              { rank: 3, name: "Kitano Mina",    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Luis&randomizeIds=true&earringColor=6bd9e9,77311d,9287ff,ac6651,d2eff3,e0ddff,f4d150,f9c9b6,fc909f,ffeba4,ffedef&earrings=hoop&ears=attached&eyebrows=eyelashesDown,eyelashesUp,up&facialHairProbability=5&hair=dannyPhantom,fonze,full,mrT,pixie,turban&mouth=laughing,nervous,pucker,smile,smirk,surprised,sad&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf', gpa: "3.69", trend: 85, delta: "–0.11", top: false },
              { rank: 4, name: "Ho Lee Sheet",    avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=Sara&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&eyes=cheery,normal,sleepy,starstruck,confused&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4", gpa: "3.48", trend: 60, delta: "+0.03", top: false },
              { rank: 5, name: "Yuno Ball",    avatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Wyatt&backgroundColor=619eff,ffd5dc,b6e3f4,c0aede&mood=confused,happy,hopeful,neutral,sad,superHappy", gpa: "3.45", trend: 71, delta: "±0.00", top: false },
            ].map((p, i) => (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className={cn(
                  "group grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2.5rem_1fr_140px_auto] items-center gap-4 px-3 py-3 rounded-xl transition-colors",
                  p.top
                    ? "bg-primary/5 border border-primary/10"
                    : "hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-semibold text-center tabular-nums",
                    p.top ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {p.rank === 1 ? (
                    <Trophy className="w-4 h-4 mx-auto text-amber-500" />
                  ) : (
                    p.rank
                  )}
                </span>
                
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 border",
                      p.top
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <img src={p.avatar} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.delta.startsWith("+")
                        ? <span className="text-emerald-600">{p.delta} this week</span>
                        : p.delta.startsWith("–")
                        ? <span className="text-rose-500">{p.delta} this week</span>
                        : <span>{p.delta} this week</span>
                      }
                    </p>
                  </div>
                </div>
                    
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden w-24">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.trend}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        p.top ? "bg-primary" : "bg-muted-foreground/40"
                      )}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                    {p.trend}%
                  </span>
                </div>
                    
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums text-right",
                    p.top ? "text-primary" : "text-foreground"
                  )}
                >
                  {p.gpa}
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="border-t bg-muted/20 px-6 py-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing top 5 of 1773 students</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-3 rounded-lg gap-1.5 group"
              onClick={() => navigate("/leaderboard")}
            >
              See full rankings
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
          
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { value: "1.7k", label: "Active students" },
            { value: "1k", label: "Grades logged" },
            { value: "3.3", label: "Average GPA" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-lg font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>

    {/* How It Works */}
    <section id="how-it-works" className="w-full py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        ><div className='max-w-2xl'>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Three Steps to
            <br />
            <span className="text-primary">Clarity</span>
          </h2>
          <p className="text-base md:text-xl max-w-[600px] text-muted-foreground mx-auto">
            Upload your syllabus, customize your template, and start calculating your grades with confidence.
          </p>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Connection lines */}
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
                {/* Step Number */}
                <div className="relative mb-6">
                  <span
                    className="text-8xl font-bold text-muted/50 group-hover:text-primary/55 transition-colors duration-500 block"
                  >
                    {step.number}
                  </span>
                  <div className='absolute bottom-2 left-2 w-12 h-1 bg-primary/80 rounded-full'></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  {step.description}
                </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="w-full py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className='grid lg:grid-cols-12 gap-12'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            FAQ
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-4 sm:mb-8">
            Got questions? We've got answers. If you can't find what you're looking
            for, feel free to reach out.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Contact me at <a href="https://t.me/Adlkhy" target="_blank" rel="noopener noreferrer" className="hover:underline italic text-accent-foreground">Telegram</a>
          </motion.div>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-8"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border last:border-b rounded-2xl px-4 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-5 text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 pt-0">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
      </div>
    </section>

    {/* Call to Action */}
    <section className="w-full py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" /> */}
      {/* Dark White Dotted Grid Background */}
        <div
          className="absolute inset-0 z-0 bg-background"
          style={{
            backgroundImage:
              'radial-gradient(circle, color-mix(in oklab, var(--foreground) 24%, transparent) 1.5px, transparent 1.5px)',
            backgroundSize: "30px 30px",
            backgroundPosition: "0 0",
          }}
        />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Ready to Take Control
            <br />
            of Your Grades?
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of students who are mastering their grades with Evalis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div>
              <Button
                asChild
                size="lg"
                onClick={() => navigate('/calculator')}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8! h-11! text-base group"
              >
                <div className="cursor-pointer">
                  Try It Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Button>
            </motion.div>

            <motion.div>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8! h-11! text-base bg-transparent border-border hover:text-primary hover:bg-accent"
                onClick={() => navigate('/leaderboard')}
              ><div className='cursor-pointer'>
                Leaderboard
                </div>
              </Button>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            No login required. Free to use.
          </motion.p>
        </motion.div>
      </div>
    </section>

    
    <Footer />
    </>
  );
}


// hero section

