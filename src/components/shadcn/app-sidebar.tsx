import * as React from "react"
import { useTheme } from "@/lib/useTheme"
import {
  IconAppWindow,
  // IconBrandTelegram,
  IconHelp,
  IconMap,
  // IconMoodTongueWink,
  IconPaw,
  IconSettings,
  IconUsersGroup,
} from "@tabler/icons-react"

// import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/shadcn/nav-main"
import { NavSecondary } from "@/components/shadcn/nav-secondary"
import { NavUser } from "@/components/shadcn/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"

const data = {
  navMain: [
    // {
    //   title: "DevJokes",
    //   url: "https://github.com/shrutikapoor08/devjoke",
    //   icon: IconMoodTongueWink,
    // },
    {
      title: "AITU Map",
      url: "https://yuujiso.github.io/aitumap/",
      icon: IconMap,
    },
    {
      title: "AITU Connect",
      url: "https://uni-hub.kz/",
      icon: IconUsersGroup,
    },
    {
      title: "Here could be your project",
      url: "https://youtu.be/dQw4w9WgXcQ?si=cs98hgCR45G0Vjlb",
      icon: IconAppWindow,
    },
    // {
    //   title: "My TG Channel",
    //   url: "https://t.me/safemys",
    //   icon: IconBrandTelegram,
    // },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "https://youtu.be/dQw4w9WgXcQ?si=cs98hgCR45G0Vjlb",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "https://www.gofundme.com/c/blog/how-to-ask-for-help-with-money",
      icon: IconHelp,
    },
    {
      title: "404",
      url: "/404",
      icon: IconPaw,
    },
  ],
  // documents: [
  //   {
  //     name: "Mama",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Dada",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "You",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
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
              <div onClick={() => navigate("/", { replace: true })}>
              <span className="text-base font-semibold">Evalis</span>
              {theme === 'dark' || theme === 'cyberpunk' || theme === 'system' ?
                <img src="/white.png" alt="logo" className="h-6 ms-2" /> : <img src="/dark.png" alt="logo" className="h-6 ms-2" />
              }</div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
