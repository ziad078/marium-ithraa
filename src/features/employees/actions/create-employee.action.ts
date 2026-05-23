"use server"

import { revalidatePath } from "next/cache"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { createEmployeeSchema } from "@/features/forms/schemas/employee.schema"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { addEmployee } from "../api"

export async function createEmployeeAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, createEmployeeSchema)
  if (!parsed.success) return parsed.state

  try {
    await addEmployee(parsed.data)
    revalidatePath("/dashboards/organization/employees")
    return { status: StatusCode.CREATED, message: "تم إضافة الموظف بنجاح" }
  } catch (error) {
    return actionErrorState(error, formData, {
      conflict: "الموظف موجود فعلاً",
    })
  }
}
