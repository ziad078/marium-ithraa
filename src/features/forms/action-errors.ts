import { ApiError } from "@/lib/errors/ApiError"
import { StatusCode } from "@/lib/types/enums"
import type { InitialState } from "@/lib/types/types"

export function actionErrorState(
  error: unknown,
  formData: FormData | null,
  messages?: { conflict?: string; server?: string },
): InitialState {
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
        message: messages?.conflict,
      }
    }
  }

  return {
    formData,
    status: StatusCode.INTERNALSERVERERROR,
    message: messages?.server ?? "حدث خطأ ما، تواصل مع الدعم",
  }
}
