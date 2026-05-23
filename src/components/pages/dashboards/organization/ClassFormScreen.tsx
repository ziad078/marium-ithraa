"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GradientButton } from "@/components/shared/management/GradientButton"
import { Button } from "@/components/ui/button"
import {
  createClassAction,
  updateClassAction,
  type ClassItem,
} from "@/features/classes"
import { type Grade } from "@/features/grades"
import { type Teacher } from "@/features/teachers/types"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

type Props = {
  locale: string
  organizationId: string
  grades: Grade[]
  teachers: Teacher[]
  defaultGradeId?: string
  classItem?: ClassItem
}

export function ClassFormScreen({
  locale,
  organizationId,
  grades,
  teachers,
  defaultGradeId,
  classItem,
}: Props) {
  const isAr = locale === "ar"
  const router = useRouter()
  const isEdit = Boolean(classItem)
  const action = isEdit ? updateClassAction : createClassAction

  const [gradeId, setGradeId] = useState(
    classItem?.gradeId ?? defaultGradeId ?? "",
  )
  const [teacherId, setTeacherId] = useState(classItem?.teacherId ?? "")

  const [state, formAction, isPending] = useActionState<InitialState, FormData>(
    action,
    { message: "", error: {}, status: null, formData: null },
  )

  useEffect(() => {
    if (!state?.status) return
    if (state.status === StatusCode.CREATED || state.status === StatusCode.OK) {
      toast.success(state.message ?? (isAr ? "تم الحفظ بنجاح" : "Saved"))
      router.push("/dashboards/organization/classes")
    } else if (state.message) toast.error(state.message)
  }, [state, isAr, router])

  const pageTitle = isEdit
    ? isAr
      ? "تعديل فصل"
      : "Edit class"
    : isAr
      ? "إضافة فصل"
      : "Add class"

  const nameError = state.error?.name
  const nameErr = Array.isArray(nameError) ? nameError[0] : nameError
  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { href: "/dashboards/organization/classes", label: isAr ? "الفصول" : "Classes" },
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
            {isEdit && <input type="hidden" name="id" value={classItem!.id} />}
            <input type="hidden" name="organizationId" value={organizationId} />
            <input type="hidden" name="gradeId" value={gradeId} />
            {teacherId ? <input type="hidden" name="teacherId" value={teacherId} /> : null}

            <div className="space-y-2">
              <Label htmlFor="name">{isAr ? "اسم الفصل" : "Class name"}</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={classItem?.name}
                className={nameErr ? "border-red-500" : ""}
              />
              {nameErr && <p className="text-sm text-red-500">{nameErr}</p>}
            </div>

            <div className="space-y-2">
              <Label>{isAr ? "المرحلة" : "Grade"}</Label>
              <Select value={gradeId} onValueChange={setGradeId} required>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder={isAr ? "اختر المرحلة" : "Select grade"} />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{isAr ? "المعلم (اختياري)" : "Teacher (optional)"}</Label>
              <Select
                value={teacherId || "none"}
                onValueChange={(v) => setTeacherId(v === "none" ? "" : v)}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder={isAr ? "بدون معلم" : "No teacher"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{isAr ? "بدون" : "None"}</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t.teacherId} value={t.teacherId}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Link href="/dashboards/organization/classes">
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
