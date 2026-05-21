"use client"

import Link from "next/link"
import { Layers3, Plus } from "lucide-react"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EmptyState } from "@/components/shared/management/EmptyState"
import { type Grade } from "@/features/grades"
import { type Child } from "@/features/children"
type Props = {
  locale: string
  grade: Grade
  childrenByClass: Record<string, Child[]>
}

export function GradeDetailScreen({ locale, grade, childrenByClass }: Props) {
  const isAr = locale === "ar"
  const classes = grade.classes ?? []

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { href: "/dashboards/organization/grades", label: isAr ? "المراحل" : "Grades" },
          { label: grade.name },
        ]}
        title={grade.name}
        subtitle={
          isAr
            ? `${classes.length} فصول`
            : `${classes.length} classes`
        }
        action={{
          label: isAr ? "إضافة فصل" : "Add class",
          href: `/dashboards/organization/classes/new?gradeId=${grade.id}`,
          icon: <Plus />,
        }}
      />

      {classes.length === 0 ? (
        <EmptyState
          title={isAr ? "لا توجد فصول في هذه المرحلة" : "No classes in this grade"}
          actionLabel={isAr ? "إضافة فصل" : "Add class"}
          actionHref={`/dashboards/organization/classes/new?gradeId=${grade.id}`}
        />
      ) : (
        <div className="space-y-10">
          {classes.map((cls) => {
            const kids = childrenByClass[cls.id] ?? cls.children ?? []
            return (
              <section key={cls.id} className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Layers3 className="size-5 text-fuchsia-600" />
                    <Link
                      href={`/dashboards/organization/classes/${cls.id}`}
                      className="hover:text-fuchsia-600"
                    >
                      {cls.name}
                    </Link>
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {kids.length} {isAr ? "طفل" : "children"}
                  </span>
                </div>

                {kids.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {isAr ? "لا يوجد أطفال في هذا الفصل" : "No children in this class"}
                  </p>
                ) : (
                  <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {kids.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/dashboards/organization/children/${child.id}`}
                          className="block rounded-xl border px-4 py-3 text-sm hover:bg-muted/50"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
