import { FormTypes } from "@/lib/types/enums"

import { employeeFormConfig } from "./employee.config"
import { loginFormConfig } from "./login.config"
import { teacherFormConfig } from "./teacher.config"
import type { FormRegistryEntry } from "../types"

export const formRegistry: Partial<Record<FormTypes, FormRegistryEntry>> = {
  [FormTypes.SIGNIN]: loginFormConfig,
  [FormTypes.EMPLOYEE]: employeeFormConfig,
  [FormTypes.TEACHER]: teacherFormConfig,
}

export { loginFormConfig, employeeFormConfig, teacherFormConfig }
