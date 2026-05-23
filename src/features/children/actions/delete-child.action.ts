"use server"

import { revalidatePath } from "next/cache"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { idSchema } from "@/features/forms/schemas/common.schema"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { deleteChild } from "../api"

export async function deleteChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, idSchema)
  if (!parsed.success) return parsed.state

  try {
    await deleteChild(parsed.data.id)
    revalidatePath("/dashboards/organization/children")
    return { status: StatusCode.OK, message: "تم حذف الطفل بنجاح" }
  } catch (error) {
    return actionErrorState(error, formData)
  }
}
