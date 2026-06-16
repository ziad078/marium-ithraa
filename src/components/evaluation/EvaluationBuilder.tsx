"use client"

import { useState } from "react"
import { showErrorToast } from "@/lib/toast/app-toast"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStartAttempt } from "@/features/evaluations/hooks"
import { startAttemptSchema } from "@/features/evaluations/types"

export default function EvaluationBuilder({ evaluationId }: { evaluationId: string }) {
  const router = useRouter()
  const start = useStartAttempt(evaluationId)
  const [childId, setChildId] = useState("")
  const [childType, setChildType] = useState<"organization" | "private">("private")

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-base">Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
        <Button
          onClick={async () => {
            const parsed = startAttemptSchema.safeParse({ childId, childType })
            if (!parsed.success) {
              showErrorToast({ raw: "Please provide a valid childId and childType." })
              return
            }
            try {
              const attempt = await start.mutateAsync(parsed.data)
              router.push(`/dashboards/parent/attempts/${attempt.id}`)
            } catch (e: unknown) {
              showErrorToast({ raw: e instanceof Error ? e.message : "Failed to start evaluation." })
            }
          }}
          disabled={start.isPending}
        >
          {start.isPending ? "Starting..." : "Start attempt"}
        </Button>
        <p className="text-xs text-muted-foreground">
          You can take a maximum of 2 attempts per child. Retake is blocked after approval.
        </p>
      </CardContent>
    </Card>
  )
}

