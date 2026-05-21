"use server"

import { deleteTeacher } from "../api"


export type DeleteTeacherdState = {
  ok: boolean
  error?: string
}

export async function deleteTeacherAction(
  _prevState: DeleteTeacherdState,
  formData: FormData,
): Promise<DeleteTeacherdState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { ok: false, error: "معرّف المعلم غير صالح" }
    }

    await deleteTeacher(id)


    return { ok: true }
  } catch {
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف المعلم" }
  }
}

