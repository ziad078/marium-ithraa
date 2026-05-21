"use server"

import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createTeacher } from "../api"
import { ApiError } from "@/lib/errors/ApiError"
import { Teacher } from "../types"
import { revalidatePath } from "next/cache"

export async function createTeacherAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const payload = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) => !key.startsWith("$ACTION_")
      )
    ) as Partial<Teacher>
    await createTeacher(payload)
    revalidatePath("/dashboards/organization/teachers")
    return { status: StatusCode.CREATED, message: "تم إضافة المعلم بنجاح" }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === StatusCode.BADREQUEST) {
        return {
          formData,
          error: error.validationErrors,
          status: StatusCode.BADREQUEST,
        }
      }
      if (error.status === StatusCode.CONFLICT) {
        return {
          formData,
          status: StatusCode.CONFLICT,
          message: "المعلم موجود فعلاً",
        }
      }
    }
    console.log(error)
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث خطأ ما، تواصل مع الدعم",
    }
  }
}