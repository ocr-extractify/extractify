import * as React from "react"
import {
  Settings2,
  FileText,
} from "lucide-react"
import { NavMain } from "@/pages/Base/fragments/nav-main"
import { NavUser } from "@/pages/Base/fragments/nav-user"
import { TeamSwitcher } from "@/pages/Base/fragments/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
// TODO: use absolute path for the /public folder
import TuiutiLogo from "../../../../public/tuiuti_logo.jpeg"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    teams: [
      {
        name: "Tuiuti",
        logo: TuiutiLogo,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Files",
        url: "#",
        icon: FileText,
        isActive: true,
        items: [
          {
            title: "Upload",
            url: "/files/upload",
          },
          {
            title: "Files",
            url: "/files",
          },
          {
            title: "Extraction configs",
            url: "/files/extraction-configs",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Appearance",
            url: "/settings/appearance",
          },
          {
            title: "Language",
            url: "/settings/language",
          }
        ],
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}