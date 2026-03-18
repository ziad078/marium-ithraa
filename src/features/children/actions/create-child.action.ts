"use server"

import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createChild } from "../api"
import { type Child } from "../types/interfaces"

export async function createChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const payload = Object.fromEntries(formData.entries()) as unknown as Partial<Child>
    const res = await createChild(payload)

    if (!res.ok) {
      if (res.status === StatusCode.BADREQUEST) {
        return {
          formData,
          error: await res.json(),
          status: StatusCode.BADREQUEST,
        }
      }
      return {
        formData,
        status: StatusCode.INTERNALSERVERERROR,
        message: "حدث خطأ ما تواصل مع الدعم",
      }
    }

    return { status: StatusCode.CREATED, message: "تم إضافة الطفل بنجاح" }
  } catch {
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث خطأ غير متوقع",
    }
  }
}

