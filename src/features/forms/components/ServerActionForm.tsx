"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState, useEffect, useTransition, type ReactNode } from "react"
import { useForm, type FieldValues } from "react-hook-form"
import type { z } from "zod"

import { Form } from "@/components/ui/form"
import { FormTypes } from "@/lib/types/enums"
import type { InitialState } from "@/lib/types/types"

import { useFormConfig } from "../hooks/useFormConfig"
import { RhfFormFields } from "./RhfFormFields"

const initialState: InitialState = {
  message: "",
  error: {},
  status: null,
  formData: null,
}

type ServerActionFormProps = {
  formType: FormTypes
  action: (_prev: InitialState, formData: FormData) => Promise<InitialState>
  hiddenFields?: Record<string, string>
  onStatusChange?: (state: InitialState) => void
  children?: ReactNode
  className?: string
}

export function ServerActionForm({
  formType,
  action,
  hiddenFields = {},
  onStatusChange,
  children,
  className,
}: ServerActionFormProps) {
  const { fields, schema, defaultValues } = useFormConfig(formType)
  const [state, formAction] = useActionState(action, initialState)
  const [isPending, startTransition] = useTransition()

  type FormValues = FieldValues

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues: defaultValues as FormValues,
    mode: "onTouched",
  })

  useEffect(() => {
    if (!state?.formData || !(state.formData instanceof FormData)) return
    for (const field of fields) {
      const value = state.formData.get(field.name)
      if (value != null) {
        form.setValue(field.name, String(value))
      }
    }
    if (state.error) {
      for (const [key, messages] of Object.entries(state.error)) {
        if (messages?.[0]) {
          form.setError(key as never, { message: messages[0] })
        }
      }
    }
  }, [state.formData, state.error, fields, form])

  useEffect(() => {
    if (state?.status) onStatusChange?.(state)
  }, [state, onStatusChange])

  const onSubmit = (values: FormValues) => {
    const fd = new FormData()
    for (const [key, value] of Object.entries({ ...hiddenFields, ...values })) {
      if (value !== undefined && value !== null && value !== "") {
        fd.set(key, String(value))
      }
    }
    startTransition(() => {
      formAction(fd)
    })
  }

  if (!schema) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <fieldset disabled={isPending} className="space-y-5">
          <RhfFormFields fields={fields} />
          {children}
        </fieldset>
      </form>
    </Form>
  )
}
