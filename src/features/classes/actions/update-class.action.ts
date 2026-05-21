"use server"

import { revalidatePath } from "next/cache"
import { ApiError } from "@/lib/errors/ApiError"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { updateClass } from "../api"

export async function updateClassAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { status: StatusCode.BADREQUEST, message: "معرّف الفصل غير صالح", formData }
    }
    const name = formData.get("name")
    const gradeId = formData.get("gradeId")
    const teacherId = formData.get("teacherId")
    await updateClass(id, {
      ...(name ? { name: String(name) } : {}),
      ...(gradeId ? { gradeId: String(gradeId) } : {}),
      ...(teacherId ? { teacherId: String(teacherId) } : {}),
    })
    revalidatePath("/dashboards/organization/classes")
    revalidatePath(`/dashboards/organization/classes/${id}`)
    return { status: StatusCode.OK, message: "تم تحديث الفصل بنجاح" }
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCode.BADREQUEST) {
      return {
        formData,
        error: error.validationErrors,
        status: StatusCode.BADREQUEST,
      }
    }
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث خطأ ما، تواصل مع الدعم",
    }
  }
}
