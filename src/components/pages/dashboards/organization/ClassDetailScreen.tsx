"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { Baby, Loader2, Plus } from "lucide-react"
import { useActionFeedback } from "@/hooks/useActionFeedback"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EmptyState } from "@/components/shared/management/EmptyState"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { type ClassItem } from "@/features/classes"
import { type Child, deleteChildAction, type DeleteChildState } from "@/features/children"
import {
  formatChildBirthDate,
  getChildEvaluationLabel,
} from "@/features/children/utils/display"

type Props = {
  locale: string
  classItem: ClassItem
  classChildren: Child[]
}

export function ClassDetailScreen({ locale, classItem, classChildren }: Props) {
  const isAr = locale === "ar"
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null)

  const { notifyDelete } = useActionFeedback()

  const [deleteState, deleteAction, isDeleting] = useActionState<
    DeleteChildState,
    FormData
  >(deleteChildAction, { success: false })

  useEffect(() => {
    if (deleteState.success) {
      notifyDelete(deleteState, "Actions.children.deleted")
      queueMicrotask(() => setDeleteTarget(null))
    } else if (deleteState.message) {
      notifyDelete(deleteState)
    }
  }, [deleteState, notifyDelete])

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { href: "/dashboards/organization/classes", label: isAr ? "الفصول" : "Classes" },
          { label: classItem.name },
        ]}
        title={classItem.name}
        subtitle={
          isAr
            ? `المرحلة: ${classItem.gradeName ?? "—"}`
            : `Grade: ${classItem.gradeName ?? "—"}`
        }
        action={{
          label: isAr ? "إضافة طفل" : "Add child",
          href: `/dashboards/organization/children/new?classId=${classItem.id}&gradeId=${classItem.gradeId}`,
          icon: <Plus />,
        }}
      />

      {classChildren.length === 0 ? (
        <EmptyState
          title={isAr ? "لا يوجد أطفال في هذا الفصل" : "No children in this class"}
          actionLabel={isAr ? "إضافة طفل" : "Add child"}
          actionHref={`/dashboards/organization/children/new?classId=${classItem.id}&gradeId=${classItem.gradeId}`}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classChildren.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, isAr)
            return (
              <Card key={child.id} className="rounded-2xl">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <Baby className="size-4 text-fuchsia-600" />
                    {child.name}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isAr ? "تاريخ الميلاد" : "Birth"}:{" "}
                    {formatChildBirthDate(child.birthDate, locale)}
                  </p>
                  <p className={`text-sm font-medium ${evalInfo.className}`}>
                    {evalInfo.label}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="rounded-xl flex-1" asChild>
                      <Link href={`/dashboards/organization/children/${child.id}`}>
                        {isAr ? "تعديل" : "Edit"}
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                      type="button"
                      onClick={() => setDeleteTarget(child)}
                    >
                      {isAr ? "حذف" : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAr ? "حذف طفل" : "Delete child"}</DialogTitle>
            <DialogDescription>
              {isAr ? "هل أنت متأكد؟" : "Are you sure?"}
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <form action={deleteAction}>
              <input type="hidden" name="id" value={deleteTarget.id} />
              <Button
                type="submit"
                variant="destructive"
                disabled={isDeleting}
                className="w-full rounded-xl"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  isAr ? "حذف" : "Delete"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
