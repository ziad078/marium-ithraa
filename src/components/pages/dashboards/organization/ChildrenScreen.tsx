"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Baby,
  Calendar,
  GraduationCap,
  Layers3,
  Loader2,
  Mail,
  Phone,
  UserRoundPlus,
} from "lucide-react"
import { toast } from "sonner"

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
import { type Child } from "@/features/children"
import {
  deleteChildAction,
  type DeleteChildState,
} from "@/features/children/actions/delete-child.action"
import { type ClassItem } from "@/features/classes"
import { type Grade } from "@/features/grades"
import {
  childMatchesSearch,
  formatChildBirthDate,
  getChildClassName,
  getChildEvaluationLabel,
  getChildGradeName,
} from "@/features/children/utils/display"
import { Gender } from "@/lib/types/enums"

type Props = {
  locale: string
  childrens: Child[]
  grades: Grade[]
  classes: ClassItem[]
}

export function ChildrenScreen({ locale, childrens, grades, classes }: Props) {
  const isAr = locale === "ar"
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState("")
  const [classFilter, setClassFilter] = useState("")

  const [deleteState, deleteAction, isDeleting] = useActionState<
    DeleteChildState,
    FormData
  >(deleteChildAction, { ok: false })

  useEffect(() => {
    if (deleteState.ok) {
      toast.success(isAr ? "تم حذف الطفل بنجاح" : "Child deleted successfully")
    } else if (deleteState.error) {
      toast.error(deleteState.error)
    }
  }, [deleteState, isAr])

  const classOptionsForGrade = useMemo(() => {
    if (!gradeFilter) return classes
    return classes.filter((c) => c.gradeId === gradeFilter)
  }, [classes, gradeFilter])

  const filtered = useMemo(() => {
    return childrens.filter((child) => {
      if (!childMatchesSearch(child, search)) return false
      if (gradeFilter) {
        const gId =
          child.gradeId ??
          (typeof child.grade === "object" ? child.grade?.id : undefined) ??
          child.class?.gradeId
        const gName = getChildGradeName(child)
        const grade = grades.find((gr) => gr.id === gradeFilter)
        if (gId !== gradeFilter && gName !== grade?.name) return false
      }
      if (classFilter) {
        const cId = child.classId ?? child.class?.id
        if (cId !== classFilter) return false
      }
      return true
    })
  }, [childrens, search, gradeFilter, classFilter, grades])

  const title = isAr ? "الأطفال" : "Children"
  const addLabel = isAr ? "إضافة طفل" : "Add child"
  const editLabel = isAr ? "تعديل" : "Edit"
  const deleteLabel = isAr ? "حذف" : "Delete"

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { label: title },
        ]}
        title={title}
        subtitle={
          isAr
            ? "إدارة أطفال المؤسسة وتعيينهم على الفصول"
            : "Manage organization children and class assignments"
        }
        action={{
          label: addLabel,
          href: "/dashboards/organization/children/new",
          icon: <UserRoundPlus />,
        }}
      />

      <ListFilters
        locale={locale}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={
          isAr
            ? "بحث باسم الطفل أو ولي الأمر..."
            : "Search by child or parent..."
        }
        gradeFilter={{
          value: gradeFilter,
          onChange: (v) => {
            setGradeFilter(v)
            setClassFilter("")
          },
          options: grades.map((g) => ({ value: g.id, label: g.name })),
          label: isAr ? "المرحلة" : "Grade",
          allLabel: isAr ? "كل المراحل" : "All grades",
        }}
        classFilter={{
          value: classFilter,
          onChange: setClassFilter,
          options: classOptionsForGrade.map((c) => ({
            value: c.id,
            label: c.name,
          })),
          label: isAr ? "الفصل" : "Class",
          allLabel: isAr ? "كل الفصول" : "All classes",
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={isAr ? "لا توجد بيانات" : "No data"}
          actionLabel={childrens.length === 0 ? addLabel : undefined}
          actionHref={
            childrens.length === 0
              ? "/dashboards/organization/children/new"
              : undefined
          }
        />
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, isAr)
            const genderLabel =
              child.gender === Gender.MALE
                ? isAr
                  ? "ذكر"
                  : "Male"
                : child.gender === Gender.FEMALE
                  ? isAr
                    ? "أنثى"
                    : "Female"
                  : (child.gender ?? "—")

            return (
              <EntityCard
                key={child.id}
                editLabel={editLabel}
                deleteLabel={deleteLabel}
                fields={[
                  {
                    label: isAr ? "الاسم" : "Name",
                    value: child.name,
                    icon: <Baby />,
                  },
                  {
                    label: isAr ? "تاريخ الميلاد" : "Birth date",
                    value: formatChildBirthDate(child.birthDate, locale),
                    icon: <Calendar />,
                  },
                  {
                    label: isAr ? "النوع" : "Gender",
                    value: genderLabel,
                  },
                  {
                    label: isAr ? "المرحلة" : "Grade",
                    value: getChildGradeName(child),
                    icon: <GraduationCap />,
                  },
                  {
                    label: isAr ? "الفصل" : "Class",
                    value: getChildClassName(child),
                    icon: <Layers3 />,
                  },
                  ...(child.parent?.name
                    ? [
                        {
                          label: isAr ? "ولي الأمر" : "Parent",
                          value: child.parent.name,
                        },
                      ]
                    : []),
                  ...(child.parent?.email
                    ? [
                        {
                          label: isAr ? "البريد" : "Email",
                          value: child.parent.email,
                          icon: <Mail />,
                        },
                      ]
                    : []),
                  ...(child.parent?.phone
                    ? [
                        {
                          label: isAr ? "الهاتف" : "Phone",
                          value: child.parent.phone,
                          icon: <Phone />,
                        },
                      ]
                    : []),
                  {
                    label: isAr ? "حالة التقييم" : "Evaluation",
                    value: evalInfo.label,
                    valueClassName: evalInfo.className,
                  },
                  ...(child.attemptsUsed != null
                    ? [
                        {
                          label: isAr ? "المحاولات" : "Attempts",
                          value: String(child.attemptsUsed),
                        },
                      ]
                    : []),
                ]}
                renderEditDialog={({ open, onClose }) => (
                  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>{editLabel}</DialogTitle>
                        <DialogDescription>
                          {isAr ? "انتقل لصفحة التعديل" : "Go to edit page"}
                        </DialogDescription>
                      </DialogHeader>
                      <Button asChild className="w-full rounded-xl">
                        <Link
                          href={`/dashboards/organization/children/${child.id}`}
                          onClick={onClose}
                        >
                          {editLabel}
                        </Link>
                      </Button>
                    </DialogContent>
                  </Dialog>
                )}
                renderDeleteDialog={({ open, onClose }) => (
                  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>
                          {isAr ? "حذف طفل" : "Delete child"}
                        </DialogTitle>
                        <DialogDescription>
                          {isAr
                            ? "هل أنت متأكد؟ لا يمكن التراجع."
                            : "Are you sure? This cannot be undone."}
                        </DialogDescription>
                      </DialogHeader>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={child.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          className="w-full rounded-xl"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {isAr ? "جاري الحذف..." : "Deleting..."}
                            </>
                          ) : (
                            deleteLabel
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              />
            )
          })}
        </section>
      )}
    </main>
  )
}
