import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';
import { useTheme } from '@/lib/useTheme';
import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function Footer() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <footer className="bg-background text-foreground border-t border-dashed border-border ">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-10 md:text-left">
          {/* Brand & CTA Section */}
          <div className="col-span-2 max-w-md space-y-4 md:items-start">
            <div className='flex items-center justify-between '>
            {(theme === 'dark' || theme === 'system') ?
              <img src="/evalis-black.png" alt="logo" className="h-6 pointer-events-none" /> : <img src="/evalis-white.png" alt="logo" className="h-6 pointer-events-none" />
            }
            <blockquote className="text-sm italic text-muted-foreground ">
              Per Aspera Ad Astra 
            </blockquote>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Unlock your full academic potential! Create an account to save your grades, 
              track progress over time, and access our advanced AI assistant.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a 
                  href="https://t.me/safemys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex gap-2 hover:text-foreground transition-all duration-300 md:justify-start"
                >
                  Telegram
                </a>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <button 
                      className="flex gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 group"
                    >
                      <span>Donate</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="start" className="w-64 p-4 shadow-xl border-dashed">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          Support Project
                        </p>
                        <p className="text-xs text-muted-foreground">Scan the QR code to donate</p>
                        <figure className="w-full rounded-sm overflow-hidden">
                        <img src="/halyk.png" alt="Donate QR Code" className="w-full my-2 rounded-sm" />
                        <figcaption className="text-xs text-muted-foreground text-center">Halyk Bank (Adilkhan)</figcaption>
                        </figure>
                      </div>
                      <p className="text-[11px] italic text-center text-primary">Thanks for support!</p>
                    </div>
                  </PopoverContent>
                </Popover>
            </div>
          </div>
          {/* Navigation Section */}
          <div className="space-y-4 col-span-1 md:items-start">
            <h4 className="font-bold">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Landing</Link>
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
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4 md:items-start">
            <h4 className="font-bold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/term-of-service" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Terms of Service</Link>
              </li>
              <li>
                <Link to="/term-of-service" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">Rights & Privacy</Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="space-y-4 md:items-start">
            <h4 className="font-bold">Partners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="https://t.me/astanait_forum" target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:pl-1.5 transition-all duration-300">AITU Connect</Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <p>© 2026 Evalis. All rights reserved. <br className='md:hidden'/> Made by <a href="https://t.me/Adlkhy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">Adilkhan</a>.</p>
          <div className="flex gap-6">
            <Link to="/term-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
