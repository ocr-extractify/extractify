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
import { useTranslation } from "react-i18next"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const data = { 
    teams: [
      {
        name: "Tuiuti",
        logo: TuiutiLogo,
        plan: t("FREE"),
      },
    ],
    navMain: [
      {
        title: t("FILES"),
        url: "#",
        icon: FileText,
        isActive: true,
        items: [
          {
            title: t("UPLOAD"),
            url: "/files/upload",
          },
          {
            title: t("FILES"),
            url: "/files/sets",
          },
          // {
          //   title: "Extraction configs",
          //   url: "/files/extraction-configs",
          // },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: t('APPEARANCE'),
            url: "/settings/appearance",
          },
          {
            title: t("LANGUAGE"),
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