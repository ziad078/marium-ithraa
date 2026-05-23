import { z } from "zod"

import { StatusCode } from "@/lib/types/enums"
import type { InitialState, ValidationErrors } from "@/lib/types/types"

export function formDataToRecord(formData: FormData): Record<string, string> {
  const record: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION_")) continue
    if (typeof value === "string") record[key] = value
  }
  return record
}

export function zodErrorsToValidationErrors(error: z.ZodError): ValidationErrors {
  const validationErrors: ValidationErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_form"
    if (!validationErrors[key]) validationErrors[key] = []
    validationErrors[key].push(issue.message)
  }
  return validationErrors
}

export type ParseFormDataResult<T> =
  | { success: true; data: T }
  | { success: false; state: InitialState }

export function parseFormData<TSchema extends z.ZodType>(
  formData: FormData,
  schema: TSchema,
  options?: { message?: string },
): ParseFormDataResult<z.infer<TSchema>> {
  const result = schema.safeParse(formDataToRecord(formData))
  if (result.success) {
    return { success: true, data: result.data }
  }

  return {
    success: false,
    state: {
      formData,
      error: zodErrorsToValidationErrors(result.error),
      status: StatusCode.BADREQUEST,
      message: options?.message,
    },
  }
}
