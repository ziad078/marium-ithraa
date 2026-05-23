"use server"

import { revalidatePath } from "next/cache"

import { parseFormData } from "@/features/forms/parse-form-data"
import { idSchema } from "@/features/forms/schemas/common.schema"

import { deleteGrade } from "../api"

export type DeleteGradeState = {
  ok: boolean
  error?: string
}

export async function deleteGradeAction(
  _prevState: DeleteGradeState,
  formData: FormData,
): Promise<DeleteGradeState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return { ok: false, error: parsed.state.message ?? "معرّف المرحلة غير صالح" }
  }

  try {
    await deleteGrade(parsed.data.id)
    revalidatePath("/dashboards/organization/grades")
    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف المرحلة" }
  }
}
