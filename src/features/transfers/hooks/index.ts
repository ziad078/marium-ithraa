"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { getFriendlyApiErrorMessage } from "@/lib/helpers/apiErrorMessages"
import type {
  TransferRequest,
  TransferRequestPayload,
} from "@/lib/types/types/interfaces"
import {
  approveTransferRequest,
  createTransferRequest,
  getTransferRequests,
  rejectTransferRequest,
} from "@/features/transfers/api"

export function useTransferRequests(
  fromOrganizationId: string,
  options?: {
    enabled?: boolean
  },
) {
  return useQuery<TransferRequest[], Error>({
    queryKey: ["transferRequests", fromOrganizationId],
    queryFn: () => getTransferRequests(fromOrganizationId),
    enabled: options?.enabled ?? Boolean(fromOrganizationId),
  })
}

export function useCreateTransferRequest(onSuccess?: () => void) {
  return useMutation({
    mutationFn: createTransferRequest,
    onSuccess: () => {
      toast.success("Transfer request created")
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(getFriendlyApiErrorMessage(error))
    },
  })
}

export function useApproveTransferRequest(onSuccess?: () => void) {
  return useMutation({
    mutationFn: ({ requestId, classId }: { requestId: string; classId: string }) =>
      approveTransferRequest(requestId, classId),
    onSuccess: () => {
      toast.success("Transfer approved")
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(getFriendlyApiErrorMessage(error))
    },
  })
}

export function useRejectTransferRequest(onSuccess?: () => void) {
  return useMutation({
    mutationFn: rejectTransferRequest,
    onSuccess: () => {
      toast.success("Transfer rejected")
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(getFriendlyApiErrorMessage(error))
    },
  })
}
