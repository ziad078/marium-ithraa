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

export function SignupWizard() {
  const t = useTranslations("Signup.Beneficiary.Wizard")
  const tSignup = useTranslations("Signup")
  const router = useRouter()
  const locale = useLocale()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setStep((s) => s + 1)
  }

  function back() {
    setStep((s) => s - 1)
  }

  async function onSubmit(values: BeneficiaryOrganizationFormValues) {
    try {
      setIsSubmitting(true)

      await beneficiariesSignupClient({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        accountType: values.accountType,
        organizationName: values.organizationName,
        organizationType: values.organizationType,
      })

      await signInWithPhoneAndRedirect({
        phone: values.phone,
        password: values.password,
        push: router.push,
        login,
        locale,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Signup failed", error.message)
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

            <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={back}>
                  {t("back")}
                </Button>
              )}
              <div className="ml-auto">
                <Button type="submit" disabled={isSubmitting}>
                  {step === 1 ? t("next") : t("submit")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}