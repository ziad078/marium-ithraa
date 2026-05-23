import { FormTypes } from "@/lib/types/enums"
import type { IFormFieldsVariables } from "@/lib/types/interfaces"

import { useFormConfig } from "@/features/forms/hooks/useFormConfig"

/**
 * @deprecated Use `useFormConfig` from `@/features/forms` instead.
 */
const useFormFields = ({ slug }: IFormFieldsVariables) => {
  const { fields } = useFormConfig(slug)
  return { getFormFields: () => fields }
}

export default useFormFields
