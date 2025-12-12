import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import {
  IconStars,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconCalculator,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  onItemClick,
}: {
  onItemClick?: (item: string) => void;
}) {
  const { isMobile } = useSidebar()
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
      if (item === 'logout') {
        supabase.auth.signOut();
        navigate('/', { replace: true });
      } else if (item === 'profile') {
        navigate('/profile', { replace: true });
      } else if (item === 'calculator') {
        navigate('/', { replace: true });
      } else if (item === 'final-grades') {
        navigate('/final-grades', { replace: true });
      } else {
        onItemClick?.(item);
      }
    };

  const getUserName = () => {
    // if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.user_name) return user.user_metadata.user_name;
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'No Email';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserName()} />
                <AvatarFallback className="rounded-full">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{getUserName()}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {getUserEmail()}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserName()} />
                  <AvatarFallback className="rounded-full">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{getUserName()}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {getUserEmail()}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleItemClick('profile')}>
                <IconUserCircle />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleItemClick('final-grades')}>
                <IconStars />
                Final Grades
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleItemClick('calculator')}>
                <IconCalculator />
                Calculator
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleItemClick('logout')}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
