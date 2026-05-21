"use server"

import { revalidatePath } from "next/cache"
import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { updateChild } from "../api"
import { type UpdateChildPayload } from "../types/interfaces"
import { ApiError } from "@/lib/errors/ApiError"

export async function updateChildAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const id = formData.get("id")
    if (!id || typeof id !== "string") {
      return { status: StatusCode.BADREQUEST, message: "معرّف الطفل غير صالح", formData }
    }

    const payload: UpdateChildPayload = {}
    const name = formData.get("name")
    const birthDate = formData.get("birthDate")
    const gender = formData.get("gender")
    const classId = formData.get("classId")
    if (name) payload.name = String(name)
    if (birthDate) payload.birthDate = String(birthDate)
    if (gender) payload.gender = String(gender)
    if (classId) payload.classId = String(classId)

    await updateChild(id, payload)
    revalidatePath("/dashboards/organization/children")
    revalidatePath(`/dashboards/organization/children/${id}`)

    return { status: StatusCode.OK, message: "تم تحديث بيانات الطفل بنجاح" }
  } catch(error) {
    if( error instanceof ApiError){
      if(error.status===StatusCode.BADREQUEST){
        return{
          formData,
          error: error.validationErrors,
          status: StatusCode.BADREQUEST,
        }
      }
      if(error.status===StatusCode.CONFLICT){
        return {
          formData,
          status: StatusCode.CONFLICT,
          message: "الموظف موجود فعلا"
  
        }
      }
    }
    console.log(error)
    return {
      formData,
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث حطا ما تواصل مع الدعم"
    }
  }
}

