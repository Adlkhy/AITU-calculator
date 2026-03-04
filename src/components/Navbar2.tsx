'use client';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useTheme } from "@/lib/useTheme"
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
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
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

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

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

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
    } else if (item === 'leaderboard') {
      navigate('/leaderboard', { replace: true });
    }  else if (item === 'final-grades') {
      navigate('/final-grades', { replace: true });
    } else {
      onItemClick?.(item);
    }
  };

  // Get user display info
  const getUserName = () => {
    // if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.user_name) return user.user_metadata.user_name;
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'No email';
  };

  // const getAvatarFallback = () => {
  //   return getUserName()
  //     .split(' ')
  //     .map((n) => n[0])
  //     .join('')
  //     .toUpperCase()
  //     .slice(0, 2);
  // };
  if (!user) {
    return (
      <Button 
        variant="ghost" 
        className="h-9 px-4"
        onClick={() => navigate('/login')}
      >
        Login
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
        <DropdownMenuItem onClick={() => handleItemClick('final-grades')}>
          Final Grades
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleItemClick('leaderboard')}>
          Leaderboard
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
  navigationLinks?: Navbar08NavItem[];
  // ADD THESE PROPS FOR SUBJECT SELECTION
  subjects?: string[];
  selectedSubject?: string;
  onSelectSubject?: (subject: string) => void;
  searchPlaceholder?: string;
  searchShortcut?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNavItemClick?: (href: string) => void;
  onSearchSubmit?: (query: string) => void;
  onNotificationItemClick?: (item: string) => void;
  onUserItemClick?: (item: string) => void;
}

export const Navbar08 = React.forwardRef<HTMLElement, Navbar08Props>(
  (
    {
      className,
      logo = <Logo />,
      // REMOVED DEFAULT USER PROPS SINCE WE'RE USING REAL AUTH
      // NEW SUBJECT PROPS
      subjects = [],
      selectedSubject = '',
      onSelectSubject,
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
          setIsMobile(width < 880);
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
    const logoHome = useNavigate();
    const navigate = useNavigate();
    const { user, loading } = useUser();

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full max-w-6xl mx-auto  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8',
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
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        {(theme === 'dark' || theme === 'system') ?
                          <img src="/evalis-black.png" alt="logo" className="h-5 sm:h-6" /> : <img src="/evalis-white.png" alt="logo" className="h-5 sm:h-6" />
                        }     
                        {theme === 'dark' || theme === 'system' ?
                          <img src="/white.png" alt="logo" className="h-5 sm:h-6 ms-2 " /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6 ms-2" />
                        }
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex px-2 flex-col gap-4 py-4 overflow-y-auto max-h-[80vh]">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider px-4 mb-1 text-primary border-b border-primary/40 pb-2">Subjects</h3>
                        <div className="grid grid-cols-1 gap-1">
                          {subjects
                            .filter(s => !['Attendance', 'GPA', 'Budget'].includes(s))
                            .map((subject) => (
                              <Button
                                key={subject}
                                onClick={() => onSelectSubject?.(subject)}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "justify-start font-medium h-9 px-4",
                                  selectedSubject === subject ? "bg-accent text-primary" : "text-foreground/70"
                                )}
                              >
                                {subject}
                              </Button>
                            ))}
                        </div>
                      </div>
                      
                      {subjects.includes('Budget') && (
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider px-4 mb-1 text-primary border-b border-primary/40 pb-2">Finances</h3>
                          <Button
                            onClick={() => onSelectSubject?.('Budget')}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start font-medium h-9 px-4",
                              selectedSubject === 'Budget' ? "bg-accent text-primary" : "text-foreground/70"
                            )}
                          >
                            Budget
                          </Button>
                        </div>
                      )}

                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider px-4 mb-1 text-primary border-b border-primary/40 pb-2">Tools</h3>
                        <div className="grid grid-cols-1 gap-1">
                          {subjects
                            .filter(s => ['Attendance', 'GPA'].includes(s))
                            .map((item) => (
                              <Button
                                key={item}
                                onClick={() => onSelectSubject?.(item)}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "justify-start font-medium h-9 px-4",
                                  selectedSubject === item ? "bg-accent text-primary" : "text-foreground/70"
                                )}
                              >
                                {item}
                              </Button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => logoHome('/calculator')}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="text-2xl md:hidden">
                    {logo}
                  </div>
                  {(theme === 'dark' || theme === 'system') ?
                    <img src="/evalis-black.png" alt="logo" className="h-5 sm:h-6 hidden md:inline" /> : <img src="/evalis-white.png" alt="logo" className="h-5 sm:h-6 hidden md:inline" />
                  }
                  {theme === 'dark' || theme === 'system' ?
                  <img src="/white.png" alt="logo" className="h-6 ms-2 hidden md:inline" /> : <img src="/dark.png" alt="logo" className="h-6 ms-2 hidden md:inline" />
                  }
                  
                </button>
              </div>
            </div>
            {!isMobile && (
              <div className="flex flex-1 items-center justify-end gap-2">
                <NavigationMenu>
                  <NavigationMenuList className="gap-2">
                    {/* Subjects Dropdown */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger 
                        className={cn(
                          " font-semibold transition-all",
                          subjects.filter(s => !['Attendance', 'GPA', 'Budget'].includes(s)).includes(selectedSubject) && "bg-accent"
                        )}
                      >
                        Subjects
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[420px] gap-2 md:grid-cols-3">
                          {subjects
                            .filter(s => !['Attendance', 'GPA', 'Budget'].includes(s))
                            .map((subject) => (
                              <li key={subject}>
                                <NavigationMenuLink asChild>
                                  <button
                                    onClick={() => onSelectSubject?.(subject)}
                                    className={cn(
                                      "flex w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                      selectedSubject === subject && "bg-accent"
                                    )}
                                  >
                                    <div className="text-sm font-medium leading-none">{subject}</div>
                                  </button>
                                </NavigationMenuLink>
                              </li>
                            ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Budget Link */}
                    {subjects.includes('Budget') && (
                      <NavigationMenuItem>
                        <button
                          onClick={() => onSelectSubject?.('Budget')}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "font-semibold",
                            selectedSubject === 'Budget' && "bg-accent"
                          )}
                        >
                          Budget
                        </button>
                      </NavigationMenuItem>
                    )}

                    {/* Other Dropdown */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger 
                        className={cn(
                          "font-semibold transition-all",
                          ['Attendance', 'GPA'].includes(selectedSubject) && "bg-accent"
                        )}
                      >
                        Tools
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 md:grid-cols-2">
                          {subjects
                            .filter(s => ['Attendance', 'GPA'].includes(s))
                            .map((item) => (
                              <li key={item}>
                                <NavigationMenuLink asChild>
                                  <button
                                    onClick={() => onSelectSubject?.(item)}
                                    className={cn(
                                      "flex w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                      selectedSubject === item && "bg-accent"
                                    )}
                                  >
                                    <div className="text-sm font-medium leading-none">{item}</div>
                                  </button>
                                </NavigationMenuLink>
                              </li>
                            ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}

            {/* Right side - Theme toggle */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {/* User menu - UPDATED */}
              <ModeToggle />
              <div className='relative'>
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
                  onClick={() => navigate('/login')}
                >Login
                </Button>)}
              <UserMenu onItemClick={onUserItemClick} />
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar08.displayName = 'Navbar08';
export { Logo, HamburgerIcon };