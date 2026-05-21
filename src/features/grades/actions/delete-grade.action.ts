"use server"

import { revalidatePath } from "next/cache"
import { deleteGrade } from "../api"

export type DeleteGradeState = {
  ok: boolean
  error?: string
}

export async function deleteGradeAction(
  _prevState: DeleteGradeState,
  formData: FormData,
): Promise<DeleteGradeState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { ok: false, error: "معرّف المرحلة غير صالح" }
    }
    await deleteGrade(id)
    revalidatePath("/dashboards/organization/grades")
    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف المرحلة" }
  }
}
