import { ClassFormScreen } from "@/components/pages/dashboards/organization/ClassFormScreen"
import { getGradesByOrg } from "@/features/grades"
import { getTeachersByOrg } from "@/features/teachers/api"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ gradeId?: string }>
}

export default async function NewClassPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { gradeId } = await searchParams
  const org = await getCurrentOrganization()
  const orgId = org.user.organization.id

  const [gradesRes, teachersRes] = await Promise.all([
    getGradesByOrg(orgId),
    getTeachersByOrg(orgId),
  ])

  return (
    <ClassFormScreen
      locale={locale}
      organizationId={orgId}
      grades={gradesRes.grades}
      teachers={teachersRes.teachers}
      defaultGradeId={gradeId}
    />
  )
}
