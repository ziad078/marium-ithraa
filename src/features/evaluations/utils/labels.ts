import type { EvaluationType } from "../types"

export const EVALUATION_TYPE_LABELS: Record<
  EvaluationType,
  { ar: string; en: string }
> = {
  multiple_intelligences: {
    ar: "مؤشر الذكاءات الثمانية",
    en: "Multiple Intelligences",
  },
  pride: { ar: "مقياس برايد", en: "PRIDE Scale" },
  renzulli: { ar: "مقياس رنزولي", en: "Renzulli Scale" },
  holland: { ar: "مقياس هولاند", en: "Holland Scale" },
  learning_styles: { ar: "مقياس أساليب التعلم", en: "Learning Styles" },
  torrance: { ar: "مقياس تورانس", en: "Torrance Scale" },
}

export function getEvaluationTypeLabel(
  type: EvaluationType,
  isAr: boolean,
): string {
  const labels = EVALUATION_TYPE_LABELS[type]
  return isAr ? labels.ar : labels.en
}

export function formatAgeRange(
  ageFrom?: number | null,
  ageTo?: number | null,
  isAr = false,
): string {
  if (ageFrom == null && ageTo == null) return isAr ? "الكل" : "All ages"
  if (ageFrom != null && ageTo != null) {
    return isAr ? `${ageFrom} - ${ageTo} سنة` : `${ageFrom} - ${ageTo} years`
  }
  if (ageFrom != null) return isAr ? `من ${ageFrom} سنة` : `From ${ageFrom}`
  return isAr ? `حتى ${ageTo} سنة` : `Up to ${ageTo}`
}

export function getAttemptStatusLabel(
  status: string,
  isAr: boolean,
): string {
  const s = status.toLowerCase()
  const map: Record<string, { ar: string; en: string }> = {
    in_progress: { ar: "قيد التنفيذ", en: "In progress" },
    submitted: { ar: "تم الإرسال", en: "Submitted" },
    approved: { ar: "معتمد", en: "Approved" },
  }
  const entry = map[s]
  if (!entry) return status
  return isAr ? entry.ar : entry.en
}
