"use server"

import { revalidatePath } from "next/cache"
import { deleteClass } from "../api"

export type DeleteClassState = {
  ok: boolean
  error?: string
}

export async function deleteClassAction(
  _prevState: DeleteClassState,
  formData: FormData,
): Promise<DeleteClassState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { ok: false, error: "معرّف الفصل غير صالح" }
    }
    await deleteClass(id)
    revalidatePath("/dashboards/organization/classes")
    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف الفصل" }
  }
}
