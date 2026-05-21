import { ClassesScreenClient } from "@/components/pages/dashboards/organization/ClassesScreenClient"
import { getClassesByOrg } from "@/features/classes"
import { getGradesByOrg } from "@/features/grades"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ClassesPage({ params }: Props) {
  const { locale } = await params
  const org = await getCurrentOrganization()
  const orgId = org.user.organization.id

  const [classesRes, gradesRes] = await Promise.all([
    getClassesByOrg(orgId),
    getGradesByOrg(orgId),
  ])

  return (
    <ClassesScreenClient
      locale={locale}
      classes={classesRes.classes}
      grades={gradesRes.grades}
    />
  )
}
