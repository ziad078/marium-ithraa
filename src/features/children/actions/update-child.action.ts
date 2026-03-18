"use server"

import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { updateChild } from "../api"
import { type Child } from "../types/interfaces"

export async function updateChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { status: StatusCode.BADREQUEST, message: "معرّف الطفل غير صالح", formData }
    }

    const payload = Object.fromEntries(formData.entries().drop(1)) as unknown as Partial<Child>
    const res = await updateChild(id, payload)

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

    return { status: StatusCode.OK, message: "تم تحديث بيانات الطفل بنجاح" }
  } catch {
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث خطأ غير متوقع",
    }
  }
}

