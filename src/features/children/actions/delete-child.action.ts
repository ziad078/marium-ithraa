"use server"

import { revalidatePath } from "next/cache"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { idSchema } from "@/features/forms/schemas/common.schema"
import { deleteChild } from "../api"

export type DeleteChildState = {
  ok: boolean
  error?: string
}

export async function deleteChildAction(
  _prevState: DeleteChildState,
  formData: FormData,
): Promise<DeleteChildState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return { ok: false, error: parsed.state.message ?? "Invalid child id" }
  }

  try {
    await deleteChild(parsed.data.id)
    revalidatePath("/dashboards/organization/children")
    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف الطفل" }
  }
}
