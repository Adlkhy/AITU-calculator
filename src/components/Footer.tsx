import { Link } from 'react-router-dom';
import { Send, Heart } from 'lucide-react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { CopyButton } from './animate-ui/components/buttons/copy';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardNumber = "0000 0000 0000 0000"; 

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setCopied(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    setCopied(true);
    toast.success("Card number copied!");
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <footer className="bg-background text-foreground border-t border-dashed border-border ">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:text-left">
          {/* Brand & CTA Section */}
          <div className="space-y-4 md:items-start">
            <img src="/logo.png" alt="Evalis Logo" className="h-8 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Unlock your full academic potential! Create an account to save your grades, 
              track progress over time, and access our advanced AI assistant.
            </p>
            <div className="pt-2">
              <Link
                to="/signup"
                className="w-full md:w-auto"
              ><Button 
              variant="outline" 
              size="default" 
              className="w-full md:w-auto"
              >
                Sign Up Now
              </Button></Link>
            </div>
          </div>
          {/* Navigation Section */}
          <div className="flex flex-col md:items-start">
            <h4 className="font-semibold mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Home</Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Calculator</Link>
              </li>
              <li>
                <Link to="/ai" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">AI Tool</Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Leaderboard</Link>
              </li>
              <li>
                <Link to="/final-grades" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Final Grades</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Socials Section */}
          <div className="flex flex-col md:items-start">
            <h4 className="font-semibold mb-6">Socials</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://t.me/Adlkhy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex gap-2 hover:text-foreground hover:pl-1.5 transition-all duration-300 md:justify-start"
                >
                  <Send className="h-4 w-4" />
                  Telegram
                </a>
              </li>
              <li>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <button 
                      className="flex gap-2 text-muted-foreground hover:text-foreground hover:pl-1.5 transition-all duration-300 group"
                    >
                      <Heart className={cn("h-4 w-4 transition-colors", isOpen ? "fill-primary text-primary" : "")} />
                      <span>Donate</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="start" className="w-64 p-4 shadow-xl border-dashed">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          Support Project
                        </p>
                        <p className="text-xs text-muted-foreground">Click to copy card number</p>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-between p-2 rounded-md bg-muted hover:bg-accent transition-colors border group/card"
                      >
                        <span className="font-mono text-sm">{cardNumber}</span>
                        {copied ? (
                          <CopyButton content={cardNumber} copied={copied} size="xs"/>
                        ) : (
                          <CopyButton content={cardNumber} copied={copied} size="xs"/>
                        )}
                      </button>
                      <p className="text-[11px] italic text-center text-primary">Thanks for support!</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col md:items-start">
            <h4 className="font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link to="/term-of-service" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Terms of Service</Link>
              </li>
              <li>
                <Link to="/term-of-service" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Rights & Privacy</Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Evalis. Made by <a href="https://t.me/Adlkhy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">Adilkhan</a>.</p>
          <div className="flex gap-6">
            <Link to="/term-of-service" className="hover:text-foreground transition-colors">Rights Page</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
