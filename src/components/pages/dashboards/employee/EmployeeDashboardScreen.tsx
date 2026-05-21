"use client"

import { Baby, Bell, LayoutGrid } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import {
  ActivityFeed,
  type ActivityItem,
} from "@/components/shared/dashboard/ActivityFeed"
import { DashboardHomeLayout } from "@/components/shared/dashboard/DashboardHomeLayout"
import { QuickActionCard } from "@/components/shared/dashboard/QuickActionCard"
import { StatsGrid } from "@/components/shared/dashboard/StatsGrid"
import { WelcomeHero } from "@/components/shared/dashboard/WelcomeHero"
import { Pages, Routes } from "@/lib/types/enums"
import { useSession } from "next-auth/react"

const EMPLOYEE_URL = `/${Routes.DASHBOARDS}/${Pages.EMPLOYEE}`

export function EmployeeDashboardScreen() {
  const locale = useLocale()
  const t = useTranslations("Dashboard")
  const tNav = useTranslations("Dashboard.Nav")
  const tNotif = useTranslations("Features.Notifications")
  const isAr = locale === "ar"
  const { data: session } = useSession()

  const displayName = session?.user?.name ?? (isAr ? "الموظف" : "Employee")

  const stats = [
    {
      label: tNav("children"),
      value: "—",
      icon: <Baby />,
      variant: "purple" as const,
    },
    {
      label: tNav("analytics"),
      value: "—",
      icon: <LayoutGrid />,
      variant: "violet" as const,
    },
    {
      label: tNotif("unread"),
      value: "—",
      icon: <Bell />,
      variant: "pink" as const,
    },
    {
      label: tNav("projects"),
      value: "—",
      icon: <LayoutGrid />,
      variant: "indigo" as const,
    },
  ]

  const activities: ActivityItem[] = [
    {
      id: "1",
      title: isAr ? "لا توجد نشاطات حديثة" : "No recent activity",
      timeAgo: "—",
      icon: <Baby />,
    },
  ]

  return (
    <DashboardHomeLayout locale={locale}>
      <WelcomeHero
        title={isAr ? `مرحباً ${displayName}` : `Welcome, ${displayName}`}
        subtitle={
          isAr
            ? "إدارة الأطفال والفصول المرتبطة بك"
            : "Manage children and classes assigned to you"
        }
      />

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">
          {isAr ? "إحصائيات المنصة" : "Platform stats"}
        </h2>
        <StatsGrid items={stats} />
      </section>

      <section className="space-y-4">
        <h2 className="text-start text-xl font-bold text-foreground">
          {isAr ? "اختصارات سريعة" : "Quick actions"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <QuickActionCard
            title={tNav("children")}
            description={
              isAr ? "عرض قائمة الأطفال" : "View children list"
            }
            href={`${EMPLOYEE_URL}/${Pages.CHILDREN}`}
            icon={<Baby />}
            actionLabel={isAr ? "فتح" : "Open"}
          />
          <QuickActionCard
            title={tNotif("title")}
            description={
              isAr ? "متابعة التنبيهات" : "View notifications"
            }
            href={`/${Routes.DASHBOARDS}/notifications`}
            icon={<Bell />}
            actionLabel={tNotif("viewAll")}
          />
        </div>
      </section>

      <ActivityFeed
        title={isAr ? "آخر النشاطات" : "Recent activity"}
        items={activities}
      />
    </DashboardHomeLayout>
  )
}
