"use server"

import { revalidatePath } from "next/cache"

import { actionErrorState } from "@/features/forms/action-errors"
import { parseFormData } from "@/features/forms/parse-form-data"
import { createClassSchema } from "@/features/forms/schemas/class.schema"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { createClass } from "../api"

export async function createClassAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, createClassSchema)
  if (!parsed.success) return parsed.state

  try {
    const { teacherId, ...rest } = parsed.data
    await createClass({
      ...rest,
      ...(teacherId ? { teacherId } : {}),
    })
    revalidatePath("/dashboards/organization/classes")
    return { status: StatusCode.CREATED, message: "تم إضافة الفصل بنجاح" }
  } catch (error) {
    return actionErrorState(error, formData, {
      conflict: "الفصل موجود فعلاً",
    })
  }
}
