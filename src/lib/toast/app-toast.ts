import { toast } from "sonner"

type Translator = (key: string) => string

function translate(t: Translator, messageKey: string): string {
  try {
    return t(messageKey)
  } catch {
    return messageKey
  }
}

export function showSuccessToast(t: Translator, messageKey: string): void {
  toast.success(translate(t, messageKey))
}

export function showErrorToast(t: Translator, messageKey: string): void {
  toast.error(translate(t, messageKey))
}

export function showInfoToast(t: Translator, messageKey: string): void {
  toast.info(translate(t, messageKey))
}
