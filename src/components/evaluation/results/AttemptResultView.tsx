"use client"

import type { EvaluationType } from "@/features/evaluations/types"
import { GenericResultView } from "./GenericResultView"
import { HollandResult } from "./HollandResult"
import { LearningStylesResult } from "./LearningStylesResult"
import { MultipleIntelligencesResult } from "./MultipleIntelligencesResult"
import { PrideResult } from "./PrideResult"
import { RenzulliResult } from "./RenzulliResult"

type Props = {
  type: EvaluationType
  result: Record<string, unknown> | null | undefined
  locale: string
  title?: string
}

export function AttemptResultView({ type, result, locale, title }: Props) {
  const isAr = locale === "ar"

  if (!result || Object.keys(result).length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {isAr ? "لا توجد نتيجة بعد" : "No result available yet"}
      </p>
    )
  }

  switch (type) {
    case "multiple_intelligences":
      return <MultipleIntelligencesResult result={result} isAr={isAr} />
    case "pride":
      return <PrideResult result={result} isAr={isAr} />
    case "renzulli":
      return <RenzulliResult result={result} isAr={isAr} />
    case "holland":
      return <HollandResult result={result} isAr={isAr} />
    case "learning_styles":
      return <LearningStylesResult result={result} isAr={isAr} />
    default:
      return (
        <GenericResultView
          result={result}
          title={title ?? (isAr ? "النتيجة" : "Result")}
        />
      )
  }
}
