"use server"

import { revalidatePath } from "next/cache"

import { parseFormData } from "@/features/forms/parse-form-data"
import { idSchema } from "@/features/forms/schemas/common.schema"

import { deleteClass } from "../api"

export type DeleteClassState = {
  ok: boolean
  error?: string
}

export async function deleteClassAction(
  _prevState: DeleteClassState,
  formData: FormData,
): Promise<DeleteClassState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return { ok: false, error: parsed.state.message ?? "معرّف الفصل غير صالح" }
  }

  try {
    await deleteClass(parsed.data.id)
    revalidatePath("/dashboards/organization/classes")
    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف الفصل" }
  }
}
