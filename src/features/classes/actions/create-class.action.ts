"use server"

import { revalidatePath } from "next/cache"
import { ApiError } from "@/lib/errors/ApiError"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createClass } from "../api"
import { type CreateClassPayload } from "../types"

export async function createClassAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const entries = Object.fromEntries(formData.entries()) as Record<string, string>
    const payload: CreateClassPayload = {
      name: entries.name,
      gradeId: entries.gradeId,
      ...(entries.teacherId ? { teacherId: entries.teacherId } : {}),
    }
    await createClass(payload)
    revalidatePath("/dashboards/organization/classes")
    return { status: StatusCode.CREATED, message: "تم إضافة الفصل بنجاح" }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === StatusCode.BADREQUEST) {
        console.log(error)
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
          message: "الفصل موجود فعلاً",
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
