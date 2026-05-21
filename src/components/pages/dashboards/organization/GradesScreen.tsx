"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { GraduationCap, Layers3, Loader2, Plus, Users } from "lucide-react"
import { toast } from "react-toastify"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EntityCard } from "@/components/shared/management/EntityCard"
import { EmptyState } from "@/components/shared/management/EmptyState"
import { ListFilters } from "@/components/shared/management/ListFilters"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type Grade, deleteGradeAction, type DeleteGradeState } from "@/features/grades"

export function GradesScreen({ locale, grades }: { locale: string; grades: Grade[] }) {
  const isAr = locale === "ar"
  const [search, setSearch] = useState("")

  const [deleteState, deleteAction, isDeleting] = useActionState<
    DeleteGradeState,
    FormData
  >(deleteGradeAction, { ok: false })

  useEffect(() => {
    if (deleteState.ok) toast.success(isAr ? "تم الحذف بنجاح" : "Deleted successfully")
    else if (deleteState.error) toast.error(deleteState.error)
  }, [deleteState, isAr])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return grades
    return grades.filter((g) => g.name.toLowerCase().includes(q))
  }, [grades, search])

  const title = isAr ? "المراحل الدراسية" : "Grades"
  const addLabel = isAr ? "إضافة مرحلة" : "Add grade"

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { label: title },
        ]}
        title={title}
        subtitle={isAr ? "إدارة المراحل الدراسية والفصول" : "Manage grades and their classes"}
        action={{
          label: addLabel,
          href: "/dashboards/organization/grades/new",
          icon: <Plus />,
        }}
      />

      <ListFilters
        locale={locale}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={isAr ? "بحث باسم المرحلة..." : "Search by grade name..."}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={isAr ? "لا توجد بيانات" : "No data"}
          actionLabel={grades.length === 0 ? addLabel : undefined}
          actionHref={
            grades.length === 0 ? "/dashboards/organization/grades/new" : undefined
          }
        />
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((grade) => (
            <EntityCard
              key={grade.id}
              editLabel={isAr ? "تعديل" : "Edit"}
              deleteLabel={isAr ? "حذف" : "Delete"}
              fields={[
                {
                  label: isAr ? "الاسم" : "Name",
                  value: (
                    <Link
                      href={`/dashboards/organization/grades/${grade.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {grade.name}
                    </Link>
                  ),
                  icon: <GraduationCap />,
                },
                {
                  label: isAr ? "عدد الفصول" : "Classes",
                  value: String(grade.classesCount ?? grade.classes?.length ?? 0),
                  icon: <Layers3 />,
                },
                {
                  label: isAr ? "عدد الأطفال" : "Children",
                  value: String(grade.childrenCount ?? "—"),
                  icon: <Users />,
                },
              ]}
              renderEditDialog={({ open, onClose }) => (
                <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>{isAr ? "تعديل مرحلة" : "Edit grade"}</DialogTitle>
                    </DialogHeader>
                    <Button asChild className="w-full rounded-xl">
                      <Link
                        href={`/dashboards/organization/grades/${grade.id}/edit`}
                        onClick={onClose}
                      >
                        {isAr ? "تعديل" : "Edit"}
                      </Link>
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
              renderDeleteDialog={({ open, onClose }) => (
                <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>{isAr ? "حذف مرحلة" : "Delete grade"}</DialogTitle>
                      <DialogDescription>
                        {isAr ? "هل أنت متأكد؟" : "Are you sure?"}
                      </DialogDescription>
                    </DialogHeader>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={grade.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        className="w-full rounded-xl"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          isAr ? "حذف" : "Delete"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            />
          ))}
        </section>
      )}
    </main>
  )
}
