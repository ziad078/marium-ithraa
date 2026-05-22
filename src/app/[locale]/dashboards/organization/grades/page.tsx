import { GradesScreen } from "@/components/pages/dashboards/organization/GradesScreen"
import { getGradesByOrg } from "@/features/grades"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function GradesPage({ params }: Props) {
  const { locale } = await params
  const org = await getCurrentOrganization()
  console.log(org)
  const { grades } = await getGradesByOrg(org.user.organization.id)
  console.log(grades)
  return <GradesScreen locale={locale} grades={grades} />
}
