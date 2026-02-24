import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';
import { ModeToggle } from '@/components/mode-toggle';
import { useTheme } from "@/lib/useTheme";
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, 
  Sparkles, ArrowRight, 
  Check, Twitter, 
  Palette, Type, 
  Layers, Sliders, 
  Contrast, 
  Rocket,
  Code} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'AI', href: '#ai' },
  { label: 'FAQ', href: '#faq' },
];

const features1 = [
  'Real-time Preview',
  'Export to Tailwind',
  'Beautiful Presets',
];

const themePresets = [
  { name: 'Modern Minimal', colors: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da'] },
  { name: 'Twitter', colors: ['#1d9bf0', '#1d9bf020', '#15202b', '#ffffff'] },
  { name: 'Amethyst Haze', colors: ['#9b59b6', '#8e44ad', '#f3e5f5', '#ffffff'] },
  { name: 'Catppuccin', colors: ['#f5c2e7', '#cba6f7', '#1e1e2e', '#313244'] },
  { name: 'Kodama Grove', colors: ['#a8d5ba', '#7cb87c', '#f5f5dc', '#4a5d4a'] },
  { name: 'Quantum Rose', colors: ['#ff6b9d', '#c44569', '#fff0f3', '#2d3436'] },
  { name: 'Elegant Luxury', colors: ['#d4af37', '#1a1a2e', '#f5f5f5', '#16213e'] },
  { name: 'Neo Brutalism', colors: ['#ff006e', '#3a86ff', '#ffbe0b', '#000000'] },
  { name: 'Cyberpunk', colors: ['#00f5ff', '#ff00ff', '#0a0a0a', '#1a0a1a'] },
  { name: 'Caffeine', colors: ['#6f4e37', '#d4a574', '#f5e6d3', '#3d2914'] },
  { name: 'Midnight Bloom', colors: ['#2d1b4e', '#1a0f2e', '#ff6b9d', '#c77dff'] },
  { name: 'Violet Bloom', colors: ['#7c3aed', '#a78bfa', '#f5f3ff', '#4c1d95'] },
  { name: 'Mocha Mousse', colors: ['#a67b5b', '#8b6f47', '#f5ebe0', '#5d4e37'] },
  { name: 'Notebook', colors: ['#f7f7f7', '#e0e0e0', '#333333', '#ffffff'] },
  { name: 'Graphite', colors: ['#2d2d2d', '#404040', '#1a1a1a', '#525252'] },
  { name: 'Cosmic Night', colors: ['#0f0f23', '#1a1a3e', '#6366f1', '#8b5cf6'] },
  { name: 'Nature', colors: ['#22c55e', '#16a34a', '#dcfce7', '#14532d'] },
  { name: 'Amber Minimal', colors: ['#f59e0b', '#d97706', '#fffbeb', '#92400e'] },
  { name: 'Solar Dusk', colors: ['#f97316', '#fb923c', '#fff7ed', '#c2410c'] },
  { name: 'Pastel Dreams', colors: ['#fbcfe8', '#c7d2fe', '#fef3c7', '#e0e7ff'] },
  { name: 'Ocean Breeze', colors: ['#0ea5e9', '#38bdf8', '#e0f2fe', '#0369a1'] },
  { name: 'Candyland', colors: ['#f472b6', '#a78bfa', '#fde68a', '#67e8f9'] },
  { name: 'Sunset Horizon', colors: ['#f43f5e', '#f97316', '#fbbf24', '#fb7185'] },
  { name: 'T3 Chat', colors: ['#2e1065', '#7c3aed', '#ddd6fe', '#1e1b4b'] },
  { name: 'Bubblegum', colors: ['#ff8fab', '#fb6f92', '#ffe5ec', '#ffc2d1'] },
  { name: 'Doom 64', colors: ['#8b0000', '#4a0000', '#ff4444', '#1a0000'] },
  { name: 'Perpetuity', colors: ['#14b8a6', '#2dd4bf', '#ccfbf1', '#0f766e'] },
  { name: 'Tangerine', colors: ['#fb923c', '#fbbf24', '#fff7ed', '#ea580c'] },
  { name: 'Bold Tech', colors: ['#3b82f6', '#06b6d4', '#eff6ff', '#1e40af'] },
  { name: 'Supabase', colors: ['#3ecf8e', '#65d9a5', '#e6f9ef', '#2b8256'] },
  { name: 'Claymorphism', colors: ['#ff9a9e', '#fecfef', '#fecfef', '#ff9a9e'] },
  { name: 'Clean Slate', colors: ['#f8fafc', '#e2e8f0', '#64748b', '#0f172a'] },
  { name: 'Retro Arcade', colors: ['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b'] },
  { name: 'Northern Lights', colors: ['#00d9ff', '#00ff88', '#7b2cbf', '#ff006e'] },
];

const testimonials = [
  {
    id: 1,
    name: 'YiMing',
    handle: '@yimingdothan',
    avatar: 'Y',
    content: 'v0 + tweakcn + chatgpt for graphics\n\ngenerated a landing page in about 2~ hours\n\ncrazy how easy this shit is now',
  },
  {
    id: 2,
    name: 'Guillermo Rauch',
    handle: '@rauchg',
    avatar: 'G',
    content: "If you're looking to learn:\n▪️ full stack Next.js\n▪️ how to build a focused product people love\n\n… look no further than tweakcn by @iamsahaj_xyz. It's an open-source @shadcn theme builder.",
  },
  {
    id: 3,
    name: 'shadcn',
    handle: '@shadcn',
    avatar: 'S',
    content: '4/n - Finally, a custom theme from tweakcn by @iamsahaj_xyz',
  },
  {
    id: 4,
    name: 'Kevin Kern',
    handle: '@kregenrek',
    avatar: 'K',
    content: 'Tweakcn is really cool. Custom shadcn themes on the fly.',
  },
  {
    id: 5,
    name: 'OrcDev',
    handle: '@theorcdev',
    avatar: 'O',
    content: 'Transform your Shadcn app with one click!\n\n@iamsahaj_xyz created a great concept with Tweakcn ⚔️',
  },
  {
    id: 6,
    name: 'Ciara Wearen',
    handle: '@nocheerleader',
    avatar: 'C',
    content: 'Create a Custom Theme: Your app instantly looks more intentional.\n\nBuild a color palette, typography and layout preview with tweakcn dot com\n\nGrab the CSS → drop into Bolt = cohesive design',
  },
  {
    id: 7,
    name: 'Tanpreet Jolly',
    handle: '@JollyTanpreet',
    avatar: 'T',
    content: 'I just tried tweakcn and seems like you nailed it. This is what I have been looking for, awesome job!',
  },
  {
    id: 8,
    name: 'Code With Antonio',
    handle: '@YTCodeAntonio',
    avatar: 'A',
    content: 'there is an entire chapter dedicated to tweakcn!! such a cool project',
  },
  {
    id: 9,
    name: 'Emir',
    handle: '@emirthedev',
    avatar: 'E',
    content: 'Started using tweakcn for client projects too. This is a real game changer',
  },
  {
    id: 10,
    name: 'Matt Silverlock',
    handle: '@elithrar',
    avatar: 'M',
    content: 'used this shadcn theme editor to make it a little less plain: tweakcn.com',
  },
];

const features = [
  {
    icon: Palette,
    title: 'Color Control',
    description:
      'Customize background, text, and border colors with an intuitive color picker interface.',
  },
  {
    icon: Type,
    title: 'Typography Settings',
    description:
      'Fine-tune font size, weight, and text transform to create the perfect look.',
  },
  {
    icon: Layers,
    title: 'Tailwind v4 & v3',
    description:
      'Seamlessly switch between Tailwind versions with support for OKLCH & HSL formats.',
  },
  {
    icon: Sliders,
    title: 'Detailed Properties',
    description:
      'Fine-tune every aspect including radius, spacing, shadows, and other properties.',
  },
  {
    icon: Contrast,
    title: 'Contrast Checker',
    description:
      'Ensure designs meet accessibility standards with built-in contrast ratio checking.',
  },
  {
    icon: Sparkles,
    title: 'AI Theme Generation',
    description:
      'Create stunning, ready-to-use themes in seconds. Just provide an image or prompt.',
    badge: 'Pro',
  },
];

const aiFeatures = [
  { icon: Check, label: 'Text-to-Theme' },
  { icon: Check, label: 'Image Extraction' },
  { icon: Check, label: 'Checkpoint Restoration' },
  { icon: Check, label: 'Theme Preview' },
];

const chatMessages = [
  {
    type: 'user',
    content: 'Generate a theme from this image.',
    hasImage: true,
  },
  {
    type: 'ai',
    content:
      "I've generated a Midnight Bloom theme based on your image. It features deep purples and blues for a calming, modern look.",
  },
  {
    type: 'user',
    content: 'Can you generate a theme inspired by @Twitter?',
  },
  {
    type: 'ai',
    content:
      "Alright, I've whipped up a Twitter-inspired theme. Expect bright blues and clean contrasts for a social, energetic vibe.",
  },
  {
    type: 'user',
    content: 'How about a @Supabase theme?',
  },
  {
    type: 'ai',
    content:
      "I've generated a Supabase theme for you. It uses fresh greens and dark backgrounds for a modern, developer-friendly feel.",
  },
];

const steps = [
  {
    number: '01',
    icon: Palette,
    title: 'Customize',
    description:
      'Use our intuitive editor to adjust colors, typography, spacing, and more. See changes in real-time.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Code,
    title: 'Export',
    description:
      'Copy the generated CSS or download the theme file. Compatible with both Tailwind v3 and v4.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Deploy',
    description:
      'Drop the theme into your project and watch your components transform instantly.',
    color: 'from-orange-500 to-red-500',
  },
];

const faqs = [
  {
    question: 'What is tweakcn?',
    answer:
      'tweakcn is a powerful visual theme editor for shadcn/ui components. It allows you to customize colors, typography, spacing, and other design tokens with a real-time preview. You can then export your theme and use it in your own projects.',
  },
  {
    question: 'Is it free?',
    answer:
      'Yes! The core theme editor is completely free to use. We also offer a Pro plan with additional features like AI theme generation, unlimited theme saves, and priority support.',
  },
  {
    question: "What's included in Pro?",
    answer:
      'Pro includes AI-powered theme generation from images or text prompts, unlimited theme saves, advanced color palettes, priority support, early access to new features, and the ability to export themes in multiple formats.',
  },
  {
    question: 'Supports Tailwind v4?',
    answer:
      'Absolutely! tweakcn supports both Tailwind CSS v3 and v4. You can seamlessly switch between versions and export themes in the appropriate format, including OKLCH and HSL color formats.',
  },
  {
    question: 'Can I use with existing projects?',
    answer:
      'Yes, you can easily integrate tweakcn themes into existing projects. Simply export your theme and copy the CSS variables into your project. It works with any project using shadcn/ui components.',
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
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

function ThemeCard({ theme }: { theme: { name: string; colors: string[] } }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex -space-x-1.5">
        {theme.colors.slice(0, 4).map((color, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full border-2 border-card shadow-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
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
      whileHover={{ scale: 1.02, y: -2 }}
      className="flex-shrink-0 w-[350px] p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
            <p className="text-muted-foreground text-xs">{testimonial.handle}</p>
          </div>
        </div>
        <Twitter className="w-5 h-5 text-blue-400" />
      </div>
      <p className="text-foreground text-sm whitespace-pre-line leading-relaxed">
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
              <img src="/logo.png" alt="logo" className="h-5 sm:h-6" />
              {(theme === 'dark' || theme === 'system') ?
                <img src="/white.png" alt="logo" className="h-5 sm:h-6 ms-2 " /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6 ms-2" />
              }
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
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
                >
                  <a href="#editor" className="flex items-center gap-1">
                    Try It Now
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </a>
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
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
            className="fixed inset-x-0 top-16 z-40 md:hidden"
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
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                    Try It Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="relative min-h-screen pt-20 pb-32 md:pt-32 md:pb-40 overflow-hidden grid-pattern">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
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
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6"
          >
            Design Your
            <span className="mr-2 relative inline-block">
              <span className="relative z-10 italic font-serif font-light">Perfect</span>
            </span>
            shadcn/ui Theme
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Customize colors, typography, and layouts with a real-time preview. No signup required.
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
              <div className="flex font-medium items-center gap-1">
                Start Customizing
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="default"
              onClick={() => navigate('/community')}
              className="bg-background text-foreground rounded-full px-8! h-11! text-base border-border hover:bg-accent"
            >
              <div>Browse Community</div>
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
                className="flex gap-3 animate-marquee"
                style={{ width: 'fit-content' }}
              >
                {[...themePresets.slice(0, 12), ...themePresets.slice(0, 12)].map((theme, index) => (
                  <ThemeCard key={`row1-${index}`} theme={theme} />
                ))}
              </motion.div>
            </div>
            
            {/* Row 2 - Right to Left */}
            <div className="relative">
              <motion.div
                className="flex gap-3 animate-marquee-reverse"
                style={{ width: 'fit-content' }}
              >
                {[...themePresets.slice(12, 24), ...themePresets.slice(12, 24)].map((theme, index) => (
                  <ThemeCard key={`row2-${index}`} theme={theme} />
                ))}
              </motion.div>
            </div>
            
            {/* Row 3 - Left to Right */}
            <div className="relative">
              <motion.div
                className="flex gap-3 animate-marquee"
                style={{ width: 'fit-content' }}
              >
                {[...themePresets.slice(24), ...themePresets.slice(24)].map((theme, index) => (
                  <ThemeCard key={`row3-${index}`} theme={theme} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    {/* Testimonials */}
    <section id="testimonials" className="relative w-full py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 text-center px-4 sm:px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl tracking-tight font-bold text-foreground mb-4">
            Loved by <span className="text-primary font-serif italic">Developers</span>
          </h2>
          <p className="text-muted-foreground max-w-[600px] text-lg md:text-xl">
            See what people are saying about tweakcn
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative px-4 md:px-6">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-28 md:w-52 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 md:w-52 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Row 1 - Left to Right */}
        <div className=" overflow-hidden py-1.5">
          <motion.div
            className="flex gap-4 animate-marquee"
            style={{ width: 'fit-content' }}
          >
            {[...row1, ...row1, ...row1, ...row1].map((testimonial, index) => (
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
            {[...row2, ...row2, ...row2, ...row2].map((testimonial, index) => (
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
            Powerful Tools <br className='hidden lg:block'/>
          <span className="text-muted-foreground">
            For Total Control
          </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-[400px]">
            Everything you need to customize your shadcn/ui components and make them unique.
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
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                {feature.badge && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    {feature.badge}
                  </span>
                )}
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

    {/* AI Section */}
    <section id="ai" className="bg-muted/35 relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-accent/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='max-w-2xl mx-auto lg:mx-0 flex flex-col justify-start items-start gap-6'
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Generate Themes in
              <br />
              <span className="text-primary font-serif italic">Seconds</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Just provide an image or text prompt, and our AI will create a
              stunning, production-ready theme for you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                variant="default"
                className="bg-primary text-background hover:bg-primary/90 rounded-full px-8! h-14 text-lg group"
              >
                <div>
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
                  className="text-muted-foreground flex items-center gap-3 text-base"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </div>

            
          </motion.div>

          {/* Right Content - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-accent/50">
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    AI Theme Generator
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-5 space-y-4 max-h-[400px] overflow-hidden">
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                          : 'bg-accent text-foreground rounded-2xl rounded-tl-sm'
                      } px-4 py-3`}
                    >
                      {message.hasImage && (
                        <div className="mb-2 w-full h-24 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800" />
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="px-5 py-4 border-t border-border bg-accent/30">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-10 flex items-center ">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full bg-input border-none focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
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
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Three Steps to
            <br />
            <span className="text-primary">Perfection</span>
          </h2>
          <p className="text-lg md:text-xl max-w-[600px] text-muted-foreground mx-auto">
            We've simplified the theming process so you can focus on building your app.
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
                    className="text-8xl font-bold text-muted/20 group-hover:text-primary/10 transition-colors duration-500 block"
                  >
                    {step.number}
                  </span>
                  <div className='absolute bottom-4 left-2 w-12 h-1 bg-primary rounded-full'></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="w-full py-24 md:py-32">
      <div className="mx-auto px-4 sm:px-6">
        <div className='grid lg:grid-cols-12 gap-12'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            FAQ
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Got questions? We've got answers. If you can't find what you're looking
            for, feel free to reach out.
          </p>
          <motion.a
            href="mailto:sahaj@tweakcn.com"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground hover:underline"
          >
            Contact us at telegram
          </motion.a>
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
                className="bg-card border border-border rounded-2xl px-4 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-5 text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Ready to Make Your
            <br />
            Components <span className="text-primary">Stand Out?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Start customizing your shadcn/ui components today and create a unique
            look for your application.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8! h-12! text-base group"
              >
                <div>
                  Try It Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8! h-12 text-base bg-transparent border-border hover:bg-accent"
              >
                <a
                  href="https://github.com/jnsahaj/tweakcn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View on GitHub
                </a>
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
            No login required. Free to use. Open source.
          </motion.p>
        </motion.div>
      </div>
    </section>
    <Footer />
    </>
  );
}


// hero section
// section className="relative border-b">
//           <motion.div
//             className="pointer-events-none absolute -top-20 left-[10%] h-64 w-64 rounded-full bg-primary/20 blur-3xl"
//             animate={{ y: [0, -24, 0], x: [0, 12, 0] }}
//             transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
//           />
//           <motion.div
//             className="pointer-events-none absolute right-[10%] top-20 h-72 w-72 rounded-full bg-accent/50 blur-3xl"
//             animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
//             transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
//           />

//           <div className="container relative z-10 mx-auto grid gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
//             <motion.div
//               initial={{ opacity: 0, y: 24 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.55 }}
//               className="space-y-6"
//             >
//               <Badge variant="outline" className="rounded-full px-4 py-1 text-xs">
//                 <Sparkles className="mr-2 h-3.5 w-3.5" />
//                 Design Your Perfect shadcn/ui Theme
//               </Badge>
//               <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
//                 Build beautiful interfaces with a
//                 <span className="block text-primary">real-time visual workflow</span>
//               </h1>
//               <p className="max-w-xl text-lg text-muted-foreground">
//                 Customize colors, typography, spacing, and depth with instant preview.
//                 Export clean Tailwind-ready tokens and ship faster.
//               </p>
//               <div className="flex flex-wrap gap-3">
//                 <Button size="lg" onClick={() => navigate('/calculator')}>
//                   Start Customizing
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//                 <Button size="lg" variant="outline" onClick={() => navigate('/leaderboard')}>
//                   Browse Community
//                 </Button>
//               </div>
//               <div className="flex items-center gap-5 text-sm text-muted-foreground">
//                 <div className="font-medium text-foreground">9.4k+ stars</div>
//                 <div>No login required</div>
//                 <div>Open source</div>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 26 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.65, delay: 0.1 }}
//               className="rounded-2xl border bg-card/80 p-4 shadow-lg backdrop-blur"
//             >
//               <div className="mb-4 flex items-center justify-between border-b pb-3">
//                 <p className="text-sm font-medium">Theme Preview</p>
//                 <Badge>Live</Badge>
//               </div>
//               <div className="grid gap-4">
//                 <div className="rounded-xl border bg-background p-4">
//                   <div className="mb-3 flex items-center gap-2">
//                     <div className="h-3 w-3 rounded-full bg-primary" />
//                     <div className="h-3 w-3 rounded-full bg-accent" />
//                     <div className="h-3 w-3 rounded-full bg-muted" />
//                   </div>
//                   <div className="space-y-2">
//                     <div className="h-2 w-2/3 rounded bg-foreground/15" />
//                     <div className="h-2 w-1/2 rounded bg-foreground/10" />
//                   </div>
//                   <div className="mt-4 flex gap-2">
//                     <Button size="sm">Primary</Button>
//                     <Button size="sm" variant="outline">Secondary</Button>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <Card className="bg-background/70">
//                     <CardContent className="p-4">
//                       <p className="text-xs text-muted-foreground">Checkpoint</p>
//                       <p className="mt-1 font-semibold">Restore in 1 click</p>
//                     </CardContent>
//                   </Card>
//                   <Card className="bg-background/70">
//                     <CardContent className="p-4">
//                       <p className="text-xs text-muted-foreground">Export</p>
//                       <p className="mt-1 font-semibold">Tailwind-ready</p>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </section>
{/* <SectionWrap id="ai" className="py-20">
          <div className="container mx-auto grid items-center gap-8 px-4 lg:grid-cols-2">
            <div className="space-y-5">
              <Badge className="rounded-full">
                <Bot className="mr-2 h-3.5 w-3.5" />
                Generate themes in seconds
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Prompt or image in.
                <span className="block text-primary">Production-ready theme out.</span>
              </h2>
              <p className="text-muted-foreground">
                Create complete theme systems from a quick description and refine them visually.
              </p>
              <div className="grid gap-2 text-sm">
                {['Theme Preview', 'Checkpoint Restoration', 'Image Extraction', 'Text-to-Theme'].map((point) => (
                  <div key={point} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
                    <Check className="h-4 w-4 text-primary" />
                    {point}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={() => navigate('/ai')}>Generate with AI</Button>
                <Button variant="outline" onClick={() => navigate('/signup')}>View Pricing</Button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border bg-card p-4"
            >
              <div className="rounded-xl border bg-background p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-medium">AI Theme Builder</p>
                  <Badge variant="secondary">Pro</Badge>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                    “Build a violet + graphite dashboard theme with subtle glow and strong contrast.”
                  </div>
                  <Button className="w-full justify-between">
                    Generate
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="h-10 rounded-md bg-primary/15" />
                    <div className="h-10 rounded-md bg-accent" />
                    <div className="h-10 rounded-md bg-muted" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </SectionWrap> */}