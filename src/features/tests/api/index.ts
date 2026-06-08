import { Test } from "../types/interfaces"
import { ApiError } from "@/lib/errors/ApiError"

const TESTS_FLOW_DEPRECATED_MESSAGE =
  "This tests flow is no longer available. Please use evaluations."

export const getAllTests = async () => {
  throw new ApiError(TESTS_FLOW_DEPRECATED_MESSAGE, 410)
}

export const createTest = async (data: Partial<Test>) => {
  void data
  throw new ApiError(TESTS_FLOW_DEPRECATED_MESSAGE, 410)
}
