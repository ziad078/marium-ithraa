"use client"

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Pages, Routes } from "@/lib/types/enums"

const EMPLOYEEURL = `/${Routes.DASHBOARDS}/${Pages.EMPLOYEE}`

const EmployeeSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>)  => {
    const {data: session} =  useSession()
    const t = useTranslations()
  const data = {
    user: {
      name: session?.user.name||"",
      email: session?.user.email||"",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("Dashboard.Nav.dashboard"),
        url: EMPLOYEEURL,
        icon: IconDashboard,
      },
      {
        title: t("Dashboard.Nav.children"),
        url: `${EMPLOYEEURL}/${Pages.CHILDREN}`,
        icon: IconUsers,
      },
      {
        title: t("Dashboard.Nav.analytics"),
        url: "#",
        icon: IconChartBar,
      },
      {
        title: t("Dashboard.Nav.projects"),
        url: "#",
        icon: IconFolder,
      },
      {
        title: t("Dashboard.Nav.team"),
        url: "#",
        icon: IconUsers,
      },
    ],
    navClouds: [
      {
        title: t("Dashboard.Nav.capture"),
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: t("Dashboard.Nav.activeProposals"),
            url: "#",
          },
          {
            title: t("Dashboard.Nav.archived"),
            url: "#",
          },
        ],
      },
      {
        title: t("Dashboard.Nav.proposal"),
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: t("Dashboard.Nav.activeProposals"),
            url: "#",
          },
          {
            title: t("Dashboard.Nav.archived"),
            url: "#",
          },
        ],
      },
      {
        title: t("Dashboard.Nav.prompts"),
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: t("Dashboard.Nav.activeProposals"),
            url: "#",
          },
          {
            title: t("Dashboard.Nav.archived"),
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: t("Dashboard.Nav.settings"),
        url: "#",
        icon: IconSettings,
      },
      {
        title: t("Dashboard.Nav.getHelp"),
        url: "#",
        icon: IconHelp,
      },
      {
        title: t("Dashboard.Nav.search"),
        url: "#",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: t("Dashboard.Nav.dataLibrary"),
        url: "#",
        icon: IconDatabase,
      },
      {
        name: t("Dashboard.Nav.reports"),
        url: "#",
        icon: IconReport,
      },
      {
        name: t("Dashboard.Nav.wordAssistant"),
        url: "#",
        icon: IconFileWord,
      },
    ],
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">{"ziad"}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default EmployeeSidebar