"use server"
import { StatusCode } from "@/lib/types/enums"
import { createTest } from "../api"
import { Test } from "../types/interfaces"

export async function createTestAction(
  data: Partial<Test>
): Promise<{ status: StatusCode; message?: string; error?: unknown }> {
  try {
    if (!data.questions || data.questions.length === 0) {
      return {
        status: StatusCode.BADREQUEST,
        message: "questions can't be empty",
      }
    }

    const res = await createTest(data)
    const resJson = await res.json()
    console.log(resJson)
    if (!res.ok) {
      return {
        error: resJson,
        status: StatusCode.BADREQUEST,
      }
    }

    return {
      status: StatusCode.CREATED,
      message: "تم إضافة الاختبار بنجاح",
    }
  } catch (error) {
    console.log(error)
    return {
      status: StatusCode.INTERNALSERVERERROR,
      message: "حدث خطأ غير متوقع" + error,
    }
  }
}