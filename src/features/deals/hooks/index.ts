"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { showErrorToast, showSuccessToast } from "@/lib/toast/app-toast"
import {
  getDeals,
  getDealById,
  createDeal,
  submitProposal,
  selectProposal,
  approveProposal,
  getDealProposals,
  updateProposal,
  getActivities,
  getActivitiesWithDeals,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../api"
import type { CreateDealPayload, SubmitProposalPayload } from "../types"

export const dealKeys = {
  all: ["deals"] as const,
  detail: (id: string) => ["deals", id] as const,
  activities: ["activities"] as const,
  activitiesWithDeals: ["activities", "with-deals"] as const,
}

export function useDeals(status?: string) {
  return useQuery({
    queryKey: [...dealKeys.all, status],
    queryFn: () => getDeals(status),
  })
}

export function useDealDetail(dealId: string) {
  return useQuery({
    queryKey: dealKeys.detail(dealId),
    queryFn: () => getDealById(dealId),
    enabled: !!dealId,
  })
}

export function useCreateDeal(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDealPayload) => createDeal(data),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Deal created successfully" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to create deal" })
    },
  })
}

export function useDealProposals(dealId: string) {
  return useQuery({
    queryKey: ["deals", dealId, "proposals"],
    queryFn: () => getDealProposals(dealId),
    enabled: !!dealId,
  })
}

export function useUpdateProposal(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ proposalId, price }: { proposalId: string; price: number }) =>
      updateProposal(proposalId, { price }),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Proposal updated" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to update proposal" })
    },
  })
}

export function useSubmitProposal(dealId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SubmitProposalPayload) => submitProposal(dealId, data),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Proposal submitted" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to submit proposal" })
    },
  })
}

export function useSelectProposal(dealId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: string) => selectProposal(dealId, proposalId),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Proposal selected" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to select proposal" })
    },
  })
}

export function useApproveProposal(dealId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: string) => approveProposal(dealId, proposalId),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Proposal approved" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to approve proposal" })
    },
  })
}

export function useActivities() {
  return useQuery({
    queryKey: dealKeys.activities,
    queryFn: getActivities,
  })
}

export function useActivitiesWithDeals() {
  return useQuery({
    queryKey: dealKeys.activitiesWithDeals,
    queryFn: getActivitiesWithDeals,
  })
}

export function useCreateActivity(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createActivity(name),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Activity created" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to create activity" })
    },
  })
}

export function useUpdateActivity(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateActivity(id, name),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Activity updated" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to update activity" })
    },
  })
}

export function useDeleteActivity(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      showSuccessToast({ raw: "Activity deleted" })
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      showErrorToast({ raw: error instanceof Error ? error.message : "Failed to delete activity" })
    },
  })
}
