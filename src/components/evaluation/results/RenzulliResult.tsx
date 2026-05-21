"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RenzulliResult({
  result,
  isAr,
}: {
  result: Record<string, unknown>
  isAr: boolean
}) {
  const average = result.average ?? result.avg
  const level = result.level as string | undefined
  const dimensions =
    (result.dimensions as Array<{ name?: string; average?: number; level?: string }>) ?? []

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">
              {isAr ? "المتوسط" : "Average"}:{" "}
            </span>
            {String(average ?? "—")}
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
              {isAr ? "المحاور" : "Dimensions"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dimensions.map((d, i) => (
              <p key={i} className="text-sm">
                {d.name}: {d.average ?? "—"} ({d.level ?? "—"})
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
