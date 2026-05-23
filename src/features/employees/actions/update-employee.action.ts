"use server"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { updateEmployeeSchema } from "@/features/forms/schemas/employee.schema"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { updateEmployee } from "../api"

export async function updateEmployeeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, updateEmployeeSchema)
  if (!parsed.success) return parsed.state

  try {
    const { id, ...payload } = parsed.data
    await updateEmployee(id, payload)
    return { status: StatusCode.OK, message: "تم تحديث الموظف بنجاح" }
  } catch (error) {
    return actionErrorState(error, formData, {
      conflict: "الموظف موجود فعلاً",
    })
  }
}
