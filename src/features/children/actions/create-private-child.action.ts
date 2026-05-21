"use server"

import { revalidatePath } from "next/cache"
import { ApiError } from "@/lib/errors/ApiError"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createPrivateChild } from "../api"
import { type CreatePrivateChildPayload } from "../types/interfaces"

const PRIVATE_CHILD_LIMIT = 2

export async function createPrivateChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const currentCount = Number(formData.get("currentCount") ?? "0")
    if (currentCount >= PRIVATE_CHILD_LIMIT) {
      return {
        formData,
        status: StatusCode.BADREQUEST,
        message: "تم الوصول إلى الحد الأقصى (طفلان)",
      }
    }

    const payload = Object.fromEntries(
      ["name", "birthDate", "gender"].map((k) => [k, formData.get(k)]),
    ) as unknown as CreatePrivateChildPayload

    await createPrivateChild(payload)
    revalidatePath("/dashboards/parent/children")
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
    }
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث خطأ ما، تواصل مع الدعم",
    }
  }
}
