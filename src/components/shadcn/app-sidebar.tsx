import * as React from "react"
import { useTheme } from "@/lib/useTheme"

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

const data = {
  navNavi: [
    {
      title: "Calculator",
      url: "/calculator",
    },
    {
      title: "AI",
      url: "/ai",
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
    },
    {
      title: "AITU Map",
      url: "https://yuujiso.github.io/aitumap/",
    },
    {
      title: "SyllaBusesTG",
      url: "https://t.me/aitu_syllabus",
    },
    // {
    //   title: "My TG Channel",
    //   url: "https://t.me/safemys",
    // },
  ],
  navSecondary: [
    {
      title: "404",
      url: "/404",
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
              className="cursor-pointer hover: data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div onClick={() => navigate("/calculator", { replace: true })}>
              {(theme === 'dark' || theme === 'system') ?
                <img src="/evalis-black.png" alt="logo" className="h-5 sm:h-6" /> : <img src="/evalis-white.png" alt="logo" className="h-5 sm:h-6" />
              }
              <span className="px-2">|</span>
              {theme === 'dark' || theme === 'system' ?
                <img src="/white.png" alt="logo" className="h-5 sm:h-6" /> : <img src="/dark.png" alt="logo" className="h-5 sm:h-6" />
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
