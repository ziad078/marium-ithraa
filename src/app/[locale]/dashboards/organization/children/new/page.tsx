import { CreateChildPage } from "@/components/pages/dashboards/organization/CreateChildPage"
import { getClassesByOrg } from "@/features/classes"
import { getGradesByOrg } from "@/features/grades"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ classId?: string; gradeId?: string }>
}

export default async function NewChildPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { classId, gradeId } = await searchParams
  const org = await getCurrentOrganization()
  const orgId = org.user.organization.id

  const [gradesRes, classesRes] = await Promise.all([
    getGradesByOrg(orgId),
    getClassesByOrg(orgId),
  ])

  return (
    <CreateChildPage
      locale={locale}
      organizationId={orgId}
      grades={gradesRes.grades}
      classes={classesRes.classes}
      initialClassId={classId}
      initialGradeId={gradeId}
    />
  )
}
