"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { showErrorToast } from "@/lib/toast/app-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useStartEvaluation } from "@/features/evaluations/hooks"
import { startAttemptSchema } from "@/features/evaluations/types"

export default function StartEvaluationPage() {
  const params = useParams<{ evaluationId: string }>()
  const router = useRouter()
  const evaluationId = params.evaluationId
  const start = useStartEvaluation(evaluationId)

  const [childId, setChildId] = useState("")
  const [childType, setChildType] = useState<"organization" | "private">("private")
  const [expiresInSeconds, setExpiresInSeconds] = useState<string>("")

  const payload = useMemo(() => {
    const maybe = {
      childId,
      childType,
      expiresInSeconds: expiresInSeconds ? Number(expiresInSeconds) : undefined,
    }
    const parsed = startAttemptSchema.safeParse(maybe)
    return parsed.success ? parsed.data : null
  }, [childId, childType, expiresInSeconds])

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-base">Start evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm">Child ID</label>
          <Input value={childId} onChange={(e) => setChildId(e.target.value)} placeholder="uuid" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Child Type</label>
          <select
            value={childType}
            onChange={(e) => setChildType(e.target.value as "organization" | "private")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
          >
            <option value="private">Private</option>
            <option value="organization">Organization</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm">Expires in seconds (optional)</label>
          <Input
            value={expiresInSeconds}
            onChange={(e) => setExpiresInSeconds(e.target.value)}
            placeholder="e.g. 900"
            inputMode="numeric"
          />
        </div>

        <Button
          onClick={async () => {
            if (!payload) {
              showErrorToast({ raw: "Please provide a valid childId and childType." })
              return
            }
            try {
              const attempt = await start.mutateAsync(payload)
              router.push(`/dashboards/parent/attempts/${attempt.id}`)
            } catch (e: unknown) {
              showErrorToast({ raw: e instanceof Error ? e.message : "Failed to start evaluation." })
            }
          }}
          disabled={start.isPending}
        >
          {start.isPending ? "Starting..." : "Start"}
        </Button>

        <p className="text-xs text-muted-foreground">
          If you see “Maximum attempts reached” or “Retake not allowed”, the backend rules were triggered.
        </p>
      </CardContent>
    </Card>
  )
}

