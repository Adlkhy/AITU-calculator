import * as React from "react"
import { useTheme } from "@/lib/useTheme"
import {
  IconAppWindow,
  IconBrandTelegram,
  IconMap,
  IconPaw,
  IconUsersGroup,
} from "@tabler/icons-react"

import { NavMain } from "@/components/shadcn/nav-main"
import { NavSecondary } from "@/components/shadcn/nav-secondary"
// import { NavUser } from "@/components/shadcn/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useNavigate } from "react-router-dom"
import { Calculator, Sparkles } from "lucide-react"

const data = {
  navNavi: [
    {
      title: "Calculator",
      url: "/calculator",
      icon: Calculator,
    },
    {
      title: "AI",
      url: "/ai",
      icon: Sparkles,
    }
  ],
  navMain: [
    // {
    //   title: "DevJokes",
    //   url: "https://github.com/shrutikapoor08/devjoke",
    //   icon: IconMoodTongueWink,
    // },
    {
      title: "AITU Connect",
      url: "https://t.me/astanait_forum",
      icon: IconUsersGroup,
    },
    {
      title: "AITU Map",
      url: "https://aitumap.webspace.cat/",
      icon: IconMap,
    },
    {
      title: "Prof Ratings",
      url: "https://teacherratings.vercel.app/",
      icon: IconAppWindow,
    },
    {
      title: "SyllaBuses",
      url: "https://syllabus-pearl.vercel.app/",
      icon: IconAppWindow,
    },
    {
      title: "SyllaBusesTG",
      url: "https://t.me/aitu_syllabus",
      icon: IconBrandTelegram,
    },
    // {
    //   title: "My TG Channel",
    //   url: "https://t.me/safemys",
    //   icon: IconBrandTelegram,
    // },
  ],
  navSecondary: [
    {
      title: "404",
      url: "/404",
      icon: IconPaw,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div onClick={() => navigate("/calculator", { replace: true })}>
              {(theme === 'dark' || theme === 'system') ?
                <img src="/evalis-black.png" alt="logo" className="h-5 sm:h-6" /> : <img src="/evalis-white.png" alt="logo" className="h-5 sm:h-6" />
              }
              {theme === 'dark' || theme === 'system' ?
                <img src="/white.png" alt="logo" className="h-5 sm:h-6 ms-2" /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6 ms-2" />
              }</div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <h3 className="px-4 pt-2 text-xs font-semibold text-muted-foreground uppercase">
          Navigation
        </h3>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.navNavi.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    <Link to={item.url} className="flex items-center w-full gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <h3 className="px-4 pt-2 text-xs font-semibold text-muted-foreground uppercase">
          Links
        </h3>
        <NavMain items={data.navMain}/>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
