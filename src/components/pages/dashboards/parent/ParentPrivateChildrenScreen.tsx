"use client"

import { useActionState, useEffect, useState } from "react"
import { Baby, Calendar, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EmptyState } from "@/components/shared/management/EmptyState"
import { GradientButton } from "@/components/shared/management/GradientButton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { type Child, createPrivateChildAction } from "@/features/children"
import { Gender, StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
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
  const [gender, setGender] = useState("")
  const atLimit = privateChildren.length >= PRIVATE_CHILD_LIMIT

  const [state, formAction, isPending] = useActionState<InitialState, FormData>(
    createPrivateChildAction,
    { message: "", error: {}, status: null, formData: null },
  )

  useEffect(() => {
    if (!state?.status) return
    if (state.status === StatusCode.CREATED) {
      toast.success(state.message ?? (isAr ? "تم الحفظ بنجاح" : "Saved"))
      queueMicrotask(() => {
        setOpen(false)
        setGender("")
      })
    } else if (state.message) toast.error(state.message)
  }, [state.status, state.message, isAr])

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
          <DialogContent className="sm:max-w-md">
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="currentCount" value={String(privateChildren.length)} />
              <input type="hidden" name="gender" value={gender} />
              <DialogHeader>
                <DialogTitle>{isAr ? "إضافة طفل" : "Add child"}</DialogTitle>
                <DialogDescription>
                  {isAr ? "بيانات الطفل للتقييم الخاص" : "Private evaluation child details"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="name">{isAr ? "اسم الطفل" : "Child name"}</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">{isAr ? "تاريخ الميلاد" : "Birth date"}</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className="space-y-2">
                <Label>{isAr ? "النوع" : "Gender"}</Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger>
                    <SelectValue placeholder={isAr ? "اختر" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>{isAr ? "ذكر" : "Male"}</SelectItem>
                    <SelectItem value={Gender.FEMALE}>{isAr ? "أنثى" : "Female"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending} className="rounded-xl">
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isAr ? (
                    "حفظ"
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
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
