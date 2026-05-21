import { notFound } from "next/navigation"

import { GradeDetailScreen } from "@/components/pages/dashboards/organization/GradeDetailScreen"
import { getAllChildrenByOrg } from "@/features/children"
import { type Child } from "@/features/children/types/interfaces"
import { type Grade } from "@/features/grades"
import { getGradeById } from "@/features/grades"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string; gradeId: string }>
}

export default async function GradeDetailPage({ params }: Props) {
  const { locale, gradeId } = await params
  const org = await getCurrentOrganization()
  const orgId = org.user.organization.id

  let grade: Grade
  let children: Child[]
  try {
    const [gradeRes, childrenRes] = await Promise.all([
      getGradeById(gradeId),
      getAllChildrenByOrg(orgId),
    ])
    grade = gradeRes.grade
    children = childrenRes.children
  } catch {
    notFound()
  }

  const childrenByClass: Record<string, Child[]> = {}
  for (const child of children) {
    const classId = child.classId ?? child.class?.id
    if (!classId) continue
    if (!childrenByClass[classId]) childrenByClass[classId] = []
    childrenByClass[classId].push(child)
  }

  return (
    <GradeDetailScreen
      locale={locale}
      grade={grade}
      childrenByClass={childrenByClass}
    />
  )
}
