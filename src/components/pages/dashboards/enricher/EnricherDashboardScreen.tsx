"use client"

import { Bell, Sparkles } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import {
  ActivityFeed,
  type ActivityItem,
} from "@/components/shared/dashboard/ActivityFeed"
import { DashboardHomeLayout } from "@/components/shared/dashboard/DashboardHomeLayout"
import { QuickActionCard } from "@/components/shared/dashboard/QuickActionCard"
import { StatsGrid } from "@/components/shared/dashboard/StatsGrid"
import { WelcomeHero } from "@/components/shared/dashboard/WelcomeHero"
import { Routes } from "@/lib/types/enums"
import { useSession } from "next-auth/react"

const ENRICHER_URL = `/${Routes.DASHBOARDS}/enricher`

export function EnricherDashboardScreen() {
  const locale = useLocale()
  const tNav = useTranslations("Dashboard.Nav")
  const tNotif = useTranslations("Features.Notifications")
  const isAr = locale === "ar"
  const { data: session } = useSession()

  const displayName = session?.user?.name ?? (isAr ? "المثرّي" : "Enricher")

  const stats = [
    {
      label: isAr ? "البرامج" : "Programs",
      value: "—",
      icon: <Sparkles />,
      variant: "purple" as const,
    },
    {
      label: tNav("analytics"),
      value: "—",
      icon: <Sparkles />,
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
      icon: <Sparkles />,
      variant: "indigo" as const,
    },
  ]

  const activities: ActivityItem[] = [
    {
      id: "1",
      title: isAr ? "لا توجد نشاطات حديثة" : "No recent activity",
      timeAgo: "—",
      icon: <Sparkles />,
    },
  ]

  return (
    <DashboardHomeLayout locale={locale}>
      <WelcomeHero
        title={isAr ? `مرحباً ${displayName}` : `Welcome, ${displayName}`}
        subtitle={
          isAr
            ? "تابع برامجك ومحتواك التثقيفي"
            : "Track your enrichment programs and content"
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
            title={tNav("dashboard")}
            description={
              isAr ? "العودة للوحة التحكم" : "Return to dashboard"
            }
            href={ENRICHER_URL}
            icon={<Sparkles />}
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
