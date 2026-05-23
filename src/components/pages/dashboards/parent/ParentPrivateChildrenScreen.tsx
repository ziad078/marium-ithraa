"use client"

import { useState } from "react"
import { Baby, Calendar, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { ParentPrivateChildDialog } from "./ParentPrivateChildDialog"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EmptyState } from "@/components/shared/management/EmptyState"
import { GradientButton } from "@/components/shared/management/GradientButton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { type Child } from "@/features/children"
import {
  formatChildBirthDate,
  getChildEvaluationLabel,
} from "@/features/children/utils/display"
import { Link } from "@/i18n/navigation"

const PRIVATE_CHILD_LIMIT = 2

type Props = {
  locale: string
  privateChildren: Child[]
}

export function ParentPrivateChildrenScreen({ locale, privateChildren }: Props) {
  const isAr = locale === "ar"
  const [open, setOpen] = useState(false)
  const atLimit = privateChildren.length >= PRIVATE_CHILD_LIMIT

  const title = isAr ? "أطفالي" : "My children"

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/parent", label: isAr ? "الرئيسية" : "Home" },
          { label: title },
        ]}
        title={title}
        subtitle={
          isAr
            ? `يمكنك إضافة حتى ${PRIVATE_CHILD_LIMIT} أطفال للتقييم الخاص`
            : `You can add up to ${PRIVATE_CHILD_LIMIT} children for private evaluation`
        }
      />

      {atLimit && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {isAr ? "تم الوصول إلى الحد الأقصى (طفلان)" : "Child limit reached (2 children)"}
        </p>
      )}

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <GradientButton
              type="button"
              className="rounded-xl gap-2"
              disabled={atLimit}
            >
              <Plus className="size-4" />
              {isAr ? "إضافة طفل" : "Add child"}
            </GradientButton>
          </DialogTrigger>
          <ParentPrivateChildDialog
            open={open}
            onOpenChange={setOpen}
            currentCount={privateChildren.length}
            onSuccess={() =>
              toast.success(isAr ? "تم الحفظ بنجاح" : "Saved successfully")
            }
          />
        </Dialog>
      </div>

      {privateChildren.length === 0 ? (
        <EmptyState
          title={isAr ? "لا يوجد أطفال بعد" : "No children yet"}
          actionLabel={!atLimit ? (isAr ? "إضافة طفل" : "Add child") : undefined}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {privateChildren.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, isAr)
            return (
              <Card key={child.id} className="rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Baby className="text-fuchsia-600 size-4" />
                    {child.name}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatChildBirthDate(child.birthDate, locale)}
                  </p>
                  <p className="text-sm">
                    {isAr ? "المحاولات" : "Attempts"}: {child.attemptsUsed ?? 0}
                  </p>
                  <p className="text-sm">
                    {isAr ? "إعادة التقييم" : "Retake"}:{" "}
                    {child.retakeUsed
                      ? isAr
                        ? "نعم"
                        : "Yes"
                      : isAr
                        ? "لا"
                        : "No"}
                  </p>
                  <p className={`text-sm font-medium ${evalInfo.className}`}>
                    {evalInfo.label}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 rounded-xl" asChild>
                    <Link
                      href={`/dashboards/parent/children/${child.id}/evaluations`}
                    >
                      {isAr ? "التقييمات" : "Evaluations"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}
    </main>
  )
}
