// import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import { ChevronDownIcon } from 'lucide-react';
import { ModeToggle } from "../mode-toggle"

export function SiteHeader() {
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
    }
  };
  const getUserName = () => {
    // if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.user_name) return user.user_metadata.user_name;
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'No email';
  };

  // if (!user) {
  //   return (
  //     <Button 
  //       variant="ghost" 
  //       className="h-9 px-4"
  //       onClick={() => navigate('/login')}
  //     >
  //       Login
  //     </Button>
  //   );
  // }
  
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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Leaderboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            {user ? (
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
            ) : ( 
          <Button variant="ghost" className="h-9 px-4" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
          </div>
      </div>
    </header>
  )
}
