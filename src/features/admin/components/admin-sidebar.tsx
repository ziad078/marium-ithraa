"use client"

import * as React from "react"
import {
  IconBrain,
  IconDashboard,
  IconInnerShadowTop,
  IconReport,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
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

const ADMIN_URL = `/${Routes.DASHBOARDS}/${Pages.ADMIN}`

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const t = useTranslations()

  const data = {
    user: {
      name: session?.user.name || "",
      email: session?.user.email || "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("Dashboard.Nav.dashboard"),
        url: ADMIN_URL,
        icon: IconDashboard,
      },
      {
        title: t("Dashboard.Nav.users"),
        url: `${ADMIN_URL}/${Pages.USERS}`,
        icon: IconUsers,
      },
      {
        title: t("Features.Organizations.admin.nav"),
        url: `${ADMIN_URL}/organizations`,
        icon: IconUsers,
      },
      {
        title: t("Dashboard.Nav.children"),
        url: `${ADMIN_URL}/children`,
        icon: IconUsers,
      },
      {
        title: t("Dashboard.Nav.evaluations"),
        url: `${ADMIN_URL}/evaluations`,
        icon: IconBrain,
      },
      {
        title: t("Dashboard.Nav.attempts"),
        url: `${ADMIN_URL}/attempts`,
        icon: IconReport,
      },
      {
        title: t("Features.Notifications.title"),
        url: `/${Routes.DASHBOARDS}/notifications`,
        icon: IconReport,
      },
      {
        title: t("Features.Notifications.dispatchTitle"),
        url: `${ADMIN_URL}/notifications/dispatch`,
        icon: IconReport,
      },
    ],
    // navSecondary: [
    //   {
    //     title: t("Dashboard.Nav.settings"),
    //     url: "#",
    //     icon: IconSettings,
    //   },
    //   {
    //     title: t("Dashboard.Nav.getHelp"),
    //     url: "#",
    //     icon: IconHelp,
    //   },
    // ],
    // documents: [
    //   {
    //     name: t("Dashboard.Nav.dataLibrary"),
    //     url: "#",
    //     icon: IconReport,
    //   },
    // ],
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
                <span className="text-base font-semibold">{"Admin"}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

