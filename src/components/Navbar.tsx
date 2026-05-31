'use client';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useTheme } from "@/lib/useTheme"
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Sparkles} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 324 323' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect
        x='88.1023'
        y='144.792'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 88.1023 144.792)'
        fill='currentColor'
      />
      <rect
        x='85.3459'
        y='244.537'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 85.3459 244.537)'
        fill='currentColor'
      />
    </svg>
  );
};

// User Menu Component - UPDATED WITH AUTH
const UserMenu = ({
  onItemClick
}: {
  onItemClick?: (item: string) => void;
}) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    if (item === 'logout') {
      supabase.auth.signOut();
      navigate('/', { replace: true });
    } else if (item === 'profile') {
      navigate('/profile', { replace: true });
    } else if (item === 'settings') {
      navigate('/settings', { replace: true });
    } else {
      onItemClick?.(item);
    }
  };

  // Get user display info
  const getUserName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.user_name) return user.user_metadata.user_name;
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'No email';
  };
  if (!user) {
    return (
      <Button 
        variant="ghost" 
        className="h-9 px-4"
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </Button>
    );
  }
  
  if (loading) {
    return (
      <Button variant="ghost" className="h-9 px-2 py-0" disabled>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs">...</AvatarFallback>
        </Avatar>
        <ChevronDownIcon className="h-3 w-3 ml-1" />
      </Button>
    );
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserName()} />
            <AvatarFallback className="text-xs">
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="h-3 w-3 ml-1" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getUserEmail()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleItemClick('profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleItemClick('settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleItemClick('logout')}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


// Types
export interface Navbar08NavItem {
  href?: string;
  label: string;
  active?: boolean;
}

export interface Navbar08Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  onUserItemClick?: (item: string) => void;
}

export const Navbar08 = React.forwardRef<HTMLElement, Navbar08Props>(
  (
    {
      className,
      logo = <Logo />,
      onUserItemClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 900);
        }
      };
      checkWidth();
      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);
    const navigate = useNavigate();
    const { user, loading } = useUser();

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full max-w-7xl mx-auto  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8',
          className
        )}
        {...props}
      >
        <div className="container mx-auto max-w-screen-2xl">
          {/* Top section - Logo and theme toggle */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left side - Logo */}
            <div className="flex flex-1 items-center gap-2">
              {/* Mobile menu trigger */}
              {isMobile && (
                <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        {(theme === 'dark' || theme === 'system') ?
                          <img src="/evalis-black.png" alt="logo" className="h-5 sm:h-6" width={120} height={32} loading="lazy" decoding="async" crossOrigin="anonymous" /> : <img src="/evalis-white.png" alt="logo" className="h-5 sm:h-6" width={120} height={32} loading="lazy" decoding="async" crossOrigin="anonymous" />
                        }     
                        |
                        {theme === 'dark' || theme === 'system' ?
                          <img src="/white.png" alt="logo" className="h-5 sm:h-6 " width={120} height={32} loading="lazy" decoding="async" crossOrigin="anonymous" /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6" width={120} height={32} loading="lazy" decoding="async" crossOrigin="anonymous" />
                        }
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex px-2 flex-col gap-4 py-2 overflow-y-auto max-h-[80vh]">
                    <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase">
                      Navigation
                    </h3>
                      {/* Navigation Links */}
                      <Link to="/calculator/gpa" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                        GPA
                      </Link>
                      <Link to="/calculator/final-grade" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                        Final Grade
                      </Link>
                      <Link to="/calculator/attendance" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                        Attendance
                      </Link>
                      <Link to="/calculator/budget" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                        Budget
                      </Link>
                      <Link to="/leaderboard" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                        Leaderboard
                      </Link>
                    </div>
                    <Link to="/404" className="px-4 text-xs text-muted-foreground mt-auto pb-4">
                      /404
                    </Link>
                  </SheetContent>
                </Sheet>
              )}
              {/* Logo */}
              <div className="flex items-center">
                <button
                  id="navbar-logo-btn"
                    onClick={() => navigate('/grade-tracker')}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="text-2xl md:hidden">
                    {logo}
                  </div>
                    {(theme === 'dark' || theme === 'system') ?
                      <img src="/evalis-black.png" alt="Evalis" className="h-5 sm:h-6 hidden md:inline" width={120} height={32} loading="eager" decoding="async" crossOrigin="anonymous" /> : <img src="/evalis-white.png" alt="Evalis" className="h-5 sm:h-6 hidden md:inline" width={120} height={32} loading="eager" decoding="async" crossOrigin="anonymous" />
                  }
                  <span className='px-2 hidden md:inline'>|</span>
                  {theme === 'dark' || theme === 'system' ?
                    <img src="/white.png" alt="AITU student tools" className="h-6 hidden md:inline" width={120} height={32} loading="eager" decoding="async" crossOrigin="anonymous" /> : <img src="/dark.png" alt="AITU student tools" className="h-6 hidden md:inline" width={120} height={32} loading="eager" decoding="async" crossOrigin="anonymous" />
                  }
                </button>
              </div>
            </div>
            {!isMobile && (
              <div className="flex flex-1 items-center justify-around gap-1">
                  {/* User menu - UPDATED */}
                  <Link to="/calculator/final-grade" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-base font-medium">
                    Final
                  </Link>
                  <Link to="/calculator/attendance" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-base font-medium">
                    Attendance
                  </Link>
                  <Link to="/calculator/budget" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-base font-medium">
                    Budget
                  </Link>
                  <Link to="/leaderboard" className="nav-link px-2 text-muted-foreground hover:text-foreground transition-colors text-base font-medium">
                    Leaderboard
                  </Link>
              </div>
            )}

            {/* Right side - Theme toggle */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {/* User menu - UPDATED */}
              <ModeToggle />
              <div id="ai-tool-btn" className='relative'>
              <Button 
                variant="outline"
                onClick={() => navigate('/ai')}
                size="sm"
                className='w-16 h-9 px-4 flex items-center justify-around'
                >
                <Sparkles className="h-4 w-4" />
                AI
              </Button>
              </div>
              {!user || !loading || (
                <Button 
                  variant="secondary" 
                  className="h-9 px-4"
                  onClick={() => navigate('/signup')}
                >Sign Up
                </Button>)}
              <div id="user-menu-btn">
                <UserMenu onItemClick={onUserItemClick} />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar08.displayName = 'Navbar08';
export { Logo };