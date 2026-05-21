"use server"

import { revalidatePath } from "next/cache"
import { ApiError } from "@/lib/errors/ApiError"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createGrade } from "../api"
import { type CreateGradePayload } from "../types"

export async function createGradeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const payload = Object.fromEntries(formData.entries()) as unknown as CreateGradePayload
    await createGrade(payload)
    revalidatePath("/dashboards/organization/grades")
    return { status: StatusCode.CREATED, message: "تم إضافة المرحلة بنجاح" }
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
          message: "المرحلة موجودة فعلاً",
        }
      }
    }
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث خطأ ما، تواصل مع الدعم",
    }
  }
}
