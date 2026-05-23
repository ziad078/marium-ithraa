"use server"

import { parseFormData } from "@/features/forms/parse-form-data"
import { idSchema } from "@/features/forms/schemas/common.schema"

import { deleteTeacher } from "../api"

export type DeleteTeacherdState = {
  ok: boolean
  error?: string
}

export async function deleteTeacherAction(
  _prevState: DeleteTeacherdState,
  formData: FormData,
): Promise<DeleteTeacherdState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return { ok: false, error: parsed.state.message ?? "معرّف المعلم غير صالح" }
  }

  try {
    await deleteTeacher(parsed.data.id)
    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف المعلم" }
  }
}

