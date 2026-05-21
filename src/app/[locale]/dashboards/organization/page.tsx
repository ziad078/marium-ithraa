import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"
import {
  OrganizationDashboardScreen,
  getOrganizationDashboardMockData,
} from "@/components/pages/dashboards/OrganizationDashboardScreen"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function OrganizationDashboardPage({ params }: Props) {
  const { locale } = await params
  const org = await getCurrentOrganization()

  const organizationName =
    org?.user?.organization?.organizationName ??
    (locale === "ar" ? "مدرسة النور" : "Al Noor School")

  const { stats, activities } = getOrganizationDashboardMockData(locale)

  return (
    <OrganizationDashboardScreen
      locale={locale}
      organizationName={organizationName}
      stats={stats}
      activities={activities}
    />
  )
}

