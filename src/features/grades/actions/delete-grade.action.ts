"use server"

import { revalidatePath } from "next/cache"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { idSchema } from "@/features/forms/schemas/common.schema"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { deleteGrade } from "../api"

export async function deleteGradeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) return parsed.state

  try {
    await deleteGrade(parsed.data.id)
    revalidatePath("/dashboards/organization/grades")
    return { status: StatusCode.OK, message: "تم حذف المرحلة بنجاح" }
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
