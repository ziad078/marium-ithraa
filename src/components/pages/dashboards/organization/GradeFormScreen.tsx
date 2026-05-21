"use client"

import { useActionState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "@/i18n/navigation"
import { toast } from "react-toastify"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientButton } from "@/components/shared/management/GradientButton"
import { Button } from "@/components/ui/button"
import {
  createGradeAction,
  updateGradeAction,
  type Grade,
} from "@/features/grades"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

type Props = {
  locale: string
  organizationId: string
  grade?: Grade
}

export function GradeFormScreen({ locale, organizationId, grade }: Props) {
  const isAr = locale === "ar"
  const router = useRouter()
  const isEdit = Boolean(grade)
  const action = isEdit ? updateGradeAction : createGradeAction

  const [state, formAction, isPending] = useActionState<InitialState, FormData>(
    action,
    { message: "", error: {}, status: null, formData: null },
  )

  useEffect(() => {
    if (!state?.status) return
    if (state.status === StatusCode.CREATED || state.status === StatusCode.OK) {
      toast.success(state.message ?? (isAr ? "تم الحفظ بنجاح" : "Saved"))
      router.push("/dashboards/organization/grades")
    } else if (state.message) toast.error(state.message)
  }, [state, isAr, router])

  const pageTitle = isEdit
    ? isAr
      ? "تعديل مرحلة"
      : "Edit grade"
    : isAr
      ? "إضافة مرحلة"
      : "Add grade"

  const fieldError = state.error?.name
  const err = Array.isArray(fieldError) ? fieldError[0] : fieldError

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { href: "/dashboards/organization/grades", label: isAr ? "المراحل" : "Grades" },
          { label: pageTitle },
        ]}
        title={pageTitle}
      />

      <Card className="mx-auto max-w-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            {isEdit && <input type="hidden" name="id" value={grade!.id} />}
            <input type="hidden" name="organizationId" value={organizationId} />
            <div className="space-y-2">
              <Label htmlFor="name">{isAr ? "اسم المرحلة" : "Grade name"}</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={grade?.name}
                className={err ? "border-red-500" : ""}
              />
              {err && <p className="text-sm text-red-500">{err}</p>}
            </div>
            <div className="flex gap-3">
              <GradientButton
                type="submit"
                className="flex-1 h-11 rounded-xl"
                disabled={isPending}
              >
                {isPending ? (isAr ? "جارٍ الحفظ..." : "Saving...") : isAr ? "حفظ" : "Save"}
              </GradientButton>
              <Button variant="outline" className="h-11 rounded-xl" asChild>
                <Link href="/dashboards/organization/grades">
                  {isAr ? "إلغاء" : "Cancel"}
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
