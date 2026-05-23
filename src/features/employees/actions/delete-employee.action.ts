"use server"

import { parseFormData } from "@/features/forms/parse-form-data"
import { idSchema } from "@/features/forms/schemas/common.schema"

import { deleteEmployee } from "../api"

export type DeleteEmployeeState = {
  ok: boolean
  error?: string
}

export async function deleteEmployeeAction(
  _prevState: DeleteEmployeeState,
  formData: FormData,
): Promise<DeleteEmployeeState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) {
    return { ok: false, error: parsed.state.message ?? "معرّف الموظف غير صالح" }
  }

  try {
    await deleteEmployee(parsed.data.id)
    return { ok: true }
  } catch {
    return {
      ok: false,
      error: "حدث خطأ غير متوقع أثناء حذف الموظف",
    }
  }
}

