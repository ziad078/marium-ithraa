"use client"

import { useMutation } from "@tanstack/react-query"

import { showErrorToast, showSuccessToast } from "@/lib/toast/app-toast"
import { getFriendlyApiErrorMessage } from "@/lib/helpers/apiErrorMessages"
import type {
  CreatePaymentPayload,
  PaymentResponse,
} from "@/lib/types/types/interfaces"
import { createPayment, initiatePayment, retryPayment } from "@/features/payments/api"

export function useCreatePayment(onSuccess?: (response: PaymentResponse) => void) {
  return useMutation({
    mutationFn: createPayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: "Payment created successfully" })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: getFriendlyApiErrorMessage(error) })
    },
  })
}

export function useInitiatePayment(onSuccess?: (response: PaymentResponse) => void) {
  return useMutation({
    mutationFn: initiatePayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: "Payment initiation succeeded" })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: getFriendlyApiErrorMessage(error) })
    },
  })
}

export function useRetryPayment(onSuccess?: (response: PaymentResponse) => void) {
  return useMutation({
    mutationFn: retryPayment,
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      showSuccessToast({ raw: "Payment retry succeeded" })
      onSuccess?.(response)
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: getFriendlyApiErrorMessage(error) })
    },
  })
}
