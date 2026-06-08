"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { getFriendlyApiErrorMessage } from "@/lib/helpers/apiErrorMessages"
import { StatusCode } from "@/lib/types/enums"

import { createChildFlow } from "@/features/children/api"
import type {
  CreateChildFlowPayload,
  CreateChildResponse,
} from "@/features/children/types/interfaces"

type RequestState = "idle" | "loading" | "success"

export function useCreateChild(options?: {
  onCreated?: (response: Extract<CreateChildResponse, { type: "CREATED" }>) => void
  onTransferRequired?: (
    response: Extract<CreateChildResponse, { type: "TRANSFER_REQUIRED" }>,
  ) => void
  onConflict?: (message: string) => void
}) {
  const [requestState, setRequestState] = useState<RequestState>("idle")
  const [isPending, startTransition] = useTransition()

  function createChild(payload: CreateChildFlowPayload) {
    setRequestState("loading")

    startTransition(async () => {
      try {
        const response = await createChildFlow(payload)

        if (response.type === "CREATED") {
          setRequestState("success")
          toast.success(response.message)
          options?.onCreated?.(response)
          return
        }

        if (response.type === "TRANSFER_REQUIRED") {
          setRequestState("success")
          options?.onTransferRequired?.(response)
          return
        }

        setRequestState("idle")
      } catch (err) {
        setRequestState("idle")
        const status = typeof err === "object" && err !== null && "status" in err
          ? Number((err as { status: unknown }).status)
          : undefined
        const message = err instanceof Error ? err.message : "Unable to create child"

        if (status === 409) {
          toast.error(message || "Child already exists in your school")
          options?.onConflict?.(message || "Child already exists in your school")
          return
        }

        if (status === StatusCode.FORBIDDEN) {
          toast.error(getFriendlyApiErrorMessage(err))
          return
        }

        toast.error(getFriendlyApiErrorMessage(err, message))
      }
    })
  }

  return {
    createChild,
    requestState,
    isLoading: requestState === "loading" || isPending,
  }
}
