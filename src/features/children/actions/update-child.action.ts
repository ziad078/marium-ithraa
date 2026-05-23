"use server"

import { revalidatePath } from "next/cache"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { updateChildSchema } from "@/features/forms/schemas/child.schema"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { updateChild } from "../api"

export async function updateChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, updateChildSchema)
  if (!parsed.success) return parsed.state

  try {
    const { id, ...payload } = parsed.data
    await updateChild(id, payload)
    revalidatePath("/dashboards/organization/children")
    revalidatePath(`/dashboards/organization/children/${id}`)
    return { status: StatusCode.OK, message: "تم تحديث بيانات الطفل بنجاح" }
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
