"use client"
import { useActionState, useEffect } from "react"
import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientButton } from "@/components/shared/management/GradientButton"
import { InitialState } from "@/lib/types/types"
import { FormTypes, StatusCode } from "@/lib/types/enums"
import useFormFields from "@/hooks/useFormFields"
import { createTeacherAction } from "@/features/teachers"
import { toast } from "react-toastify"
import FormFields from "@/components/shared/forms/formFields"
import { useRouter } from "next/navigation"

export function TeacherFormScreen({ locale }: { locale: string }) {
  const [state, formAction, isPending] = useActionState<InitialState, FormData>(
    createTeacherAction,
    { message: "", error: {}, status: null, formData: null },

  )
  const router = useRouter()

  const { getFormFields } = useFormFields({ slug: FormTypes.TEACHER })
  const fields = getFormFields()

  const isAr = locale === "ar"
  const pageTitle = isAr ? "إضافة معلم" : "Add Teacher"
  const subtitle = isAr
    ? "أدخل بيانات المعلم لإضافته إلى المؤسسة"
    : "Enter teacher details to add them to the organization"

  useEffect(() => {
    if (!state?.status) return

    if (state.status === StatusCode.CREATED) {
      toast.success(state.message ?? "تم اضافة المعلم بنجاح")
      router.push("/dashboards/organization/teachers")
      return
    }

    if (state.status && state.message, router) {
      toast.error(state.message)
    }
  }, [state.message, state.status, router])

  return (
    <main className="app-container py-8 space-y-10" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "الرئيسية" : "Home" },
          { href: "/dashboards/organization/teachers", label: isAr ? "المعلمين" : "Teachers" },
          { label: pageTitle },
        ]}
        title={pageTitle}
        subtitle={subtitle}
      />


      <Card className="mx-auto max-w-3xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-right text-base">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            {fields.map((field) => {
              const fieldError = state.error
              const defaultValue =
                state.formData instanceof FormData
                  ? (state.formData.get(field.name) as string) ?? ""
                  : ""

              return (
                <FormFields key={field.name} {...field} error={fieldError||{}} defaultValue={defaultValue}/>
              )
            })}
            
            <GradientButton
              className="h-11 w-full rounded-xl"
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? isAr ? "جارٍ الحفظ..." : "Saving..."
                : isAr ? "حفظ" : "Save"}
            </GradientButton>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}