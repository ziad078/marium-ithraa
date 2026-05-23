import { getTranslations } from "next-intl/server"

import { TeacherClassesScreen } from "@/components/pages/dashboards/teacher/TeacherClassesScreen"
import { getClassesByTeacher } from "@/features/classes/api"
import { getCurrentTeacher } from "@/lib/helpers/getCurrentTeacher"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TeacherClassesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations("Features.TeacherDashboard")
  const teacher = await getCurrentTeacher()

  if (!teacher?.teacherId) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">{t("classes")}</h1>
        <p className="mt-2 text-muted-foreground">{t("profileNotFound")}</p>
      </main>
    )
  }

  let classes: Awaited<ReturnType<typeof getClassesByTeacher>>["classes"] = []
  try {
    const res = await getClassesByTeacher(teacher.teacherId)
    classes = res.classes ?? []
  } catch {
    classes = teacher.classes?.map((name, index) => ({
      id: String(index),
      name,
      gradeId: "",
    })) ?? []
  }

  return <TeacherClassesScreen locale={locale} classes={classes} teacherName={teacher.name} />
}
