"use server"

import { revalidatePath } from "next/cache"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { createGradeSchema } from "@/features/forms/schemas/grade.schema"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { createGrade } from "../api"

export async function createGradeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, createGradeSchema)
  if (!parsed.success) return parsed.state

  try {
    await createGrade(parsed.data)
    revalidatePath("/dashboards/organization/grades")
    return { status: StatusCode.CREATED, message: "تم إضافة المرحلة بنجاح" }
  } catch (error) {
    return actionErrorState(error, formData, {
      conflict: "المرحلة موجودة فعلاً",
    })
  }
}
