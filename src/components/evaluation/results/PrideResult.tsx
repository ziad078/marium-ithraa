"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PrideResult({
  result,
  isAr,
}: {
  result: Record<string, unknown>
  isAr: boolean
}) {
  const total = result.totalScore ?? result.score
  const level = result.level as string | undefined
  const dimensions = (result.dimensions as Array<{ name?: string; score?: number }>) ?? []

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">
              {isAr ? "المجموع" : "Total"}:{" "}
            </span>
            {String(total ?? "—")}
          </p>
          <p>
            <span className="text-muted-foreground">
              {isAr ? "المستوى" : "Level"}:{" "}
            </span>
            {level ?? "—"}
          </p>
        </CardContent>
      </Card>
      {dimensions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isAr ? "تفصيل المحاور" : "Dimension breakdown"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dimensions.map((d, i) => (
              <p key={i} className="text-sm">
                {d.name}: {d.score ?? "—"}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
