"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LearningStylesResult({
  result,
  isAr,
}: {
  result: Record<string, unknown>
  isAr: boolean
}) {
  const dimensions =
    (result.dimensions as Array<{
      name?: string
      dominantPole?: string
      strength?: string | number
    }>) ?? []

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {isAr
          ? "لا يوجد مجموع كلي لهذا المقياس."
          : "This scale has no total score."}
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isAr ? "أبعاد الأسلوب" : "Style dimensions"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dimensions.map((d, i) => (
            <div key={i} className="rounded-md border p-3 text-sm">
              <p className="font-medium">{d.name}</p>
              <p className="text-muted-foreground">
                {isAr ? "القطب السائد" : "Dominant"}: {d.dominantPole ?? "—"}
              </p>
              <p className="text-muted-foreground">
                {isAr ? "القوة" : "Strength"}: {d.strength ?? "—"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
