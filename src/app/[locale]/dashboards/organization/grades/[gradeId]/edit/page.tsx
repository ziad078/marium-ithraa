import { notFound } from "next/navigation"

import { GradeFormScreen } from "@/components/pages/dashboards/organization/GradeFormScreen"
import { type Grade } from "@/features/grades"
import { getGradeById } from "@/features/grades"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string; gradeId: string }>
}

export default async function EditGradePage({ params }: Props) {
  const { locale, gradeId } = await params
  const org = await getCurrentOrganization()

  let grade: Grade
  try {
    grade = (await getGradeById(gradeId)).grade
  } catch {
    notFound()
  }

  return (
    <GradeFormScreen
      locale={locale}
      organizationId={org.user.organization.id}
      grade={grade}
    />
  )
}
