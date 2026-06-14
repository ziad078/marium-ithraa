"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { getFriendlyApiErrorMessage } from "@/lib/helpers/apiErrorMessages"
import type {
  CreatePaymentPayload,
  PaymentResponse,
} from "@/lib/types/types/interfaces"
import { createPayment, initiatePayment, retryPayment } from "@/features/payments/api"

export function useCreatePayment(onSuccess?: (response: PaymentResponse) => void) {
  return useMutation({
    mutationFn: createPayment,
    onSuccess: (response) => {
      toast.success("Payment created successfully")
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      toast.error(getFriendlyApiErrorMessage(error))
    },
  })
}

export function useInitiatePayment(onSuccess?: (response: PaymentResponse) => void) {
  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: (response) => {
      toast.success("Payment initiation succeeded")
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      toast.error(getFriendlyApiErrorMessage(error))
    },
  })
}

export function useRetryPayment(onSuccess?: (response: PaymentResponse) => void) {
  return useMutation({
    mutationFn: retryPayment,
    onSuccess: (response) => {
      toast.success("Payment retry succeeded")
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      toast.error(getFriendlyApiErrorMessage(error))
    },
  })
}
