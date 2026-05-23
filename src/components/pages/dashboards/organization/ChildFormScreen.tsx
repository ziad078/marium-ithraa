"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
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
import { createChildAction, updateChildAction, type Child } from "@/features/children"
import { type ClassItem } from "@/features/classes"
import { type Grade } from "@/features/grades"
import { Gender, StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

type Props = {
  locale: string
  organizationId: string
  grades: Grade[]
  classes: ClassItem[]
  child?: Child
}

export function ChildFormScreen({
  locale,
  organizationId,
  grades,
  classes,
  child,
}: Props) {
  const isAr = locale === "ar"
  const router = useRouter()
  const isEdit = Boolean(child)

  const [gender, setGender] = useState(child?.gender ?? "")
  const [gradeId, setGradeId] = useState(
    child?.gradeId ?? child?.class?.gradeId ?? "",
  )
  const [classId, setClassId] = useState(child?.classId ?? child?.class?.id ?? "")

  const action = isEdit ? updateChildAction : createChildAction
  const [state, formAction, isPending] = useActionState<InitialState, FormData>(
    action,
    { message: "", error: {}, status: null, formData: null },
  )

  const classesForGrade = useMemo(
    () => classes.filter((c) => !gradeId || c.gradeId === gradeId),
    [classes, gradeId],
  )

  useEffect(() => {
    if (!state?.status) return
    if (state.status === StatusCode.CREATED || state.status === StatusCode.OK) {
      toast.success(
        state.message ??
          (isAr ? "تم الحفظ بنجاح" : "Saved successfully"),
      )
      router.push("/dashboards/organization/children")
      return
    }
    if (state.message) toast.error(state.message)
  }, [state, isAr, router])

  const pageTitle = isEdit
    ? isAr
      ? "تعديل طفل"
      : "Edit child"
    : isAr
      ? "إضافة طفل"
      : "Add child"

  const defaultBirth =
    child?.birthDate && !Number.isNaN(new Date(child.birthDate).getTime())
      ? new Date(child.birthDate).toISOString().slice(0, 10)
      : ""

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { href: "/dashboards/organization/children", label: isAr ? "الأطفال" : "Children" },
          { label: pageTitle },
        ]}
        title={pageTitle}
        subtitle={
          isAr
            ? "أدخل بيانات الطفل وولي الأمر"
            : "Enter child and parent details"
        }
      />

      <Card className="mx-auto max-w-3xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            {isEdit && <input type="hidden" name="id" value={child!.id} />}
            <input type="hidden" name="organizationId" value={organizationId} />
            <input type="hidden" name="gender" value={gender} />
            <input type="hidden" name="classId" value={classId} />

            <Field
              label={isAr ? "اسم الطفل" : "Child name"}
              name="name"
              required
              defaultValue={child?.name}
              error={state.error?.name}
            />
            <Field
              label={isAr ? "تاريخ الميلاد" : "Birth date"}
              name="birthDate"
              type="date"
              required
              defaultValue={defaultBirth}
              error={state.error?.birthDate}
              max={new Date().toISOString().slice(0, 10)}
            />

            <div className="space-y-2">
              <Label>{isAr ? "النوع" : "Gender"}</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder={isAr ? "اختر النوع" : "Select gender"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>
                    {isAr ? "ذكر" : "Male"}
                  </SelectItem>
                  <SelectItem value={Gender.FEMALE}>
                    {isAr ? "أنثى" : "Female"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{isAr ? "المرحلة" : "Grade"}</Label>
              <Select
                value={gradeId}
                onValueChange={(v) => {
                  setGradeId(v)
                  setClassId("")
                }}
                required
              >
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
              <Label>{isAr ? "الفصل" : "Class"}</Label>
              <Select
                value={classId}
                onValueChange={setClassId}
                required
                disabled={!gradeId}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder={isAr ? "اختر الفصل" : "Select class"} />
                </SelectTrigger>
                <SelectContent>
                  {classesForGrade.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isEdit && (
              <>
                <p className="text-sm font-semibold text-muted-foreground pt-2">
                  {isAr ? "بيانات ولي الأمر" : "Parent account"}
                </p>
                <Field
                  label={isAr ? "اسم ولي الأمر" : "Parent name"}
                  name="parentName"
                  required
                  error={state.error?.parentName}
                />
                <Field
                  label={isAr ? "البريد الإلكتروني" : "Parent email"}
                  name="parentEmail"
                  type="email"
                  required
                  error={state.error?.parentEmail}
                />
                <Field
                  label={isAr ? "رقم الهاتف" : "Parent phone"}
                  name="parentPhone"
                  type="tel"
                  required
                  error={state.error?.parentPhone}
                />
                <Field
                  label={isAr ? "كلمة المرور" : "Parent password"}
                  name="parentPassword"
                  type="password"
                  required
                  error={state.error?.parentPassword}
                />
              </>
            )}

            <div className="flex gap-3 pt-2">
              <GradientButton
                className="h-11 flex-1 rounded-xl"
                type="submit"
                disabled={isPending}
              >
                {isPending
                  ? isAr
                    ? "جارٍ الحفظ..."
                    : "Saving..."
                  : isAr
                    ? "حفظ"
                    : "Save"}
              </GradientButton>
              <Button variant="outline" className="h-11 rounded-xl" asChild>
                <Link href="/dashboards/organization/children">
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

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  error,
  max,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string
  error?: string | string[]
  max?: string
}) {
  const err = Array.isArray(error) ? error[0] : error
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        max={max}
        className={err ? "border-red-500" : ""}
      />
      {err && <p className="text-sm text-red-500">{err}</p>}
    </div>
  )
}
