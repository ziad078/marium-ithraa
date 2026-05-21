"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Layers3, Loader2, Plus, School, Users } from "lucide-react"
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
import { type ClassItem, deleteClassAction, type DeleteClassState } from "@/features/classes"
import { type Grade } from "@/features/grades"

type Props = {
  locale: string
  classes: ClassItem[]
  grades: Grade[]
}

export function ClassesScreenClient({ locale, classes, grades }: Props) {
  console.log(classes)
  const isAr = locale === "ar"
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState("")

  const [deleteState, deleteAction, isDeleting] = useActionState<
    DeleteClassState,
    FormData
  >(deleteClassAction, { ok: false })

  useEffect(() => {
    if (deleteState.ok) toast.success(isAr ? "تم الحذف بنجاح" : "Deleted successfully")
    else if (deleteState.error) toast.error(deleteState.error)
  }, [deleteState, isAr])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return classes.filter((c) => {
      if (gradeFilter && c.gradeId !== gradeFilter) return false
      if (q && !c.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [classes, search, gradeFilter])

  const title = isAr ? "الفصول" : "Classes"
  const addLabel = isAr ? "إضافة فصل" : "Add class"

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { label: title },
        ]}
        title={title}
        subtitle={isAr ? "إدارة الفصول وتوزيع الطلاب والمعلمين" : "Manage classes and assignments"}
        action={{
          label: addLabel,
          href: "/dashboards/organization/classes/new",
          icon: <Plus />,
        }}
      />

      <ListFilters
        locale={locale}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={isAr ? "بحث باسم الفصل..." : "Search by class name..."}
        gradeFilter={{
          value: gradeFilter,
          onChange: setGradeFilter,
          options: grades.map((g) => ({ value: g.id, label: g.name })),
          label: isAr ? "المرحلة" : "Grade",
          allLabel: isAr ? "كل المراحل" : "All grades",
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={isAr ? "لا توجد بيانات" : "No data"}
          actionLabel={classes.length === 0 ? addLabel : undefined}
          actionHref={
            classes.length === 0 ? "/dashboards/organization/classes/new" : undefined
          }
        />
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <EntityCard
              key={c.id}
              editLabel={isAr ? "تعديل" : "Edit"}
              deleteLabel={isAr ? "حذف" : "Delete"}
              fields={[
                {
                  label: isAr ? "اسم الفصل" : "Class",
                  value: (
                    <Link
                      href={`/dashboards/organization/classes/${c.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {c.name}
                    </Link>
                  ),
                  icon: <Layers3 />,
                },
                {
                  label: isAr ? "المرحلة" : "Grade",
                  value: c.gradeName ?? "—",
                  icon: <School />,
                },
                {
                  label: isAr ? "المعلم" : "Teacher",
                  value: c.teacherName ?? (isAr ? "—" : "—"),
                },
                {
                  label: isAr ? "الطلاب" : "Students",
                  value: String(c.childrenCount ?? 0),
                  icon: <Users />,
                },
              ]}
              renderEditDialog={({ open, onClose }) => (
                <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>{isAr ? "تعديل فصل" : "Edit class"}</DialogTitle>
                    </DialogHeader>
                    <Button asChild className="w-full rounded-xl">
                      <Link
                        href={`/dashboards/organization/classes/${c.id}/edit`}
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
                      <DialogTitle>{isAr ? "حذف فصل" : "Delete class"}</DialogTitle>
                      <DialogDescription>
                        {isAr ? "هل أنت متأكد؟" : "Are you sure?"}
                      </DialogDescription>
                    </DialogHeader>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={c.id} />
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
