"use client"

import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import BeneficiarySignupTypeStep from "./BeneficiarySignupTypeStep"
import OrganizationSignupForm from "./OrganizationSignupForm"
import ParentSignupForm from "./ParentSignupForm"
import TeacherSignupForm from "./TeacherSignupForm"
import {
  type BeneficiaryOrganizationFormValues,
  createBeneficiaryOrganizationSchema,
} from "../../schemas/signup.schema"
import { beneficiariesSignupClient } from "@/features/auth/api"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { ApiError } from "@/lib/errors/ApiError"
import { signInWithPhoneAndRedirect } from "@/lib/auth/signInWithCredentials"
import { useLocale } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SignupWizard() {
  const t = useTranslations("Signup.Beneficiary.Wizard")
  const tSignup = useTranslations("Signup")
  const router = useRouter()
  const locale = useLocale()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      createBeneficiaryOrganizationSchema((key) =>
        tSignup(`Beneficiary.Validation.${key}`)
      ),
    [tSignup]
  )

  const form = useForm<BeneficiaryOrganizationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountType: "organization",
      name: "",
      email: "",
      password: "",
      phone: "",
      organizationName: "",
      organizationType: "",
    },
    mode: "onTouched",
  })

  

  const type = useWatch({
    control: form.control,
    name: "accountType",
  })

  function next() {
    setSubmitError(null)
    setStep((s) => s + 1)
  }

  function back() {
    setSubmitError(null)
    setStep((s) => s - 1)
  }

  async function onSubmit(values: BeneficiaryOrganizationFormValues) {
    setSubmitError(null)

    try {
      setIsSubmitting(true)

      const response = await beneficiariesSignupClient({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone.trim(),
        accountType: values.accountType,
        organizationName: values.organizationName.trim(),
        organizationType: values.organizationType,
      })

      const isOrganizationSignup = values.accountType === "organization"
      const pendingMessage = t("organizationPendingSuccess")

      toast.success(
        isOrganizationSignup
          ? pendingMessage
          : response.message || t("success"),
      )

      const loginResult = await signInWithPhoneAndRedirect({
        phone: values.phone,
        password: values.password,
        push: router.push,
        login,
        locale,
      })

      if (!loginResult.ok) {
        const message = t("autoLoginFailed")
        setSubmitError(message)
        toast.error(message)
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("unableToCreate")

      setSubmitError(message)
      toast.error(message)

      if (error instanceof ApiError) {
        Object.entries(error.validationErrors ?? {}).forEach(([name, messages]) => {
          const firstMessage = messages[0]
          if (!firstMessage) return

          form.setError(name as keyof BeneficiaryOrganizationFormValues, {
            message: firstMessage,
          })
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-container py-16 lg:py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm lg:p-8">
        <Form {...form}>
          <form
            onSubmit={
              step === 1
                ? (event) => {
                    event.preventDefault()
                    next()
                  }
                : form.handleSubmit(onSubmit)
            }
            className="space-y-8"
          >
            {step === 1 && <BeneficiarySignupTypeStep control={form.control} />}

            {step === 2 && (
              <div className="space-y-6">
                {type === "teacher" && <TeacherSignupForm />}
                {type === "parent" && <ParentSignupForm />}
                {type === "organization" && <OrganizationSignupForm />}
              </div>
            )}

            {submitError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={back} disabled={isSubmitting}>
                  {t("back")}
                </Button>
              )}
              <div className="ml-auto">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  {step === 1
                    ? t("next")
                    : isSubmitting
                      ? t("submitting")
                      : t("submit")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
