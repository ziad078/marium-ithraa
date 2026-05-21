"use server"

import { revalidatePath } from "next/cache"
import { ApiError } from "@/lib/errors/ApiError"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { updateGrade } from "../api"

export async function updateGradeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { status: StatusCode.BADREQUEST, message: "معرّف المرحلة غير صالح", formData }
    }
    const name = formData.get("name")
    await updateGrade(id, { name: String(name ?? "") })
    revalidatePath("/dashboards/organization/grades")
    revalidatePath(`/dashboards/organization/grades/${id}`)
    return { status: StatusCode.OK, message: "تم تحديث المرحلة بنجاح" }
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
