"use server"

import { revalidatePath } from "next/cache"
import { ApiError } from "@/lib/errors/ApiError"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createChild } from "../api"

export async function createChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const entries = Object.fromEntries(formData.entries()) as Record<string, string>

    if (entries.organizationId) {
      await createChild({
        child: {
          name: entries.name,
          birthDate: entries.birthDate,
          gender: entries.gender,
          classId: entries.classId,
          organizationId: entries.organizationId,  
        },
        parent: {
          name: entries.parentName,
          email: entries.parentEmail,
          phone: entries.parentPhone,
          password: entries.parentPassword,
          }
        })
      revalidatePath("/dashboards/organization/children")
    } else {
      await createChild(entries)
      revalidatePath("/dashboards/admin/children")
    }

    return { status: StatusCode.CREATED, message: "تم إضافة الطفل بنجاح" }
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
          message: "الطفل أو ولي الأمر موجود فعلاً",
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
