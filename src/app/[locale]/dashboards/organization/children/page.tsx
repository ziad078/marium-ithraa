import { ChildrenScreen } from "@/components/pages/dashboards/organization/ChildrenScreen"
import { getAllChildrenByOrg } from "@/features/children"
import { getClassesByOrg } from "@/features/classes"
import { getGradesByOrg } from "@/features/grades"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ChildrenPage({ params }: Props) {
  const { locale } = await params
  const org = await getCurrentOrganization()
  const orgId = org.user.organization.id

  const [childrenRes, gradesRes, classesRes] = await Promise.all([
    getAllChildrenByOrg(orgId),
    getGradesByOrg(orgId),
    getClassesByOrg(orgId),
  ])

  console.log(childrenRes, gradesRes, classesRes)

  return (
    <ChildrenScreen
      locale={locale}
      childrens={childrenRes.children}
      grades={gradesRes.grades}
      classes={classesRes.classes}
    />
  )
}
