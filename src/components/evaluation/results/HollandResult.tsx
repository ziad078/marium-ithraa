"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function HollandResult({
  result,
  isAr,
}: {
  result: Record<string, unknown>
  isAr: boolean
}) {
  const hollandCode = result.hollandCode as string | undefined
  const totalLevel = result.totalLevel as string | undefined
  const dimensions =
    (result.dimensions as Array<{
      code?: string
      name?: string
      suitable?: boolean
    }>) ?? []

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Holland: </span>
            {hollandCode ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">
              {isAr ? "المستوى الكلي" : "Total level"}:{" "}
            </span>
            {totalLevel ?? "—"}
          </p>
        </CardContent>
      </Card>
      {dimensions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isAr ? "الاهتمامات" : "Interests"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {dimensions.map((d) => (
              <Badge
                key={d.code ?? d.name}
                variant={d.suitable ? "default" : "outline"}
              >
                {d.name ?? d.code}
                {d.suitable != null &&
                  ` — ${d.suitable ? (isAr ? "مناسب" : "Suitable") : isAr ? "غير مناسب" : "Not suitable"}`}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
