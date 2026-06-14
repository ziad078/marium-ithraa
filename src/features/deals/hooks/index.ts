"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
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
    onSuccess: () => {
      toast.success("Deal created successfully")
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to create deal")
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
    onSuccess: () => {
      toast.success("Proposal updated")
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to update proposal")
    },
  })
}

export function useSubmitProposal(dealId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SubmitProposalPayload) => submitProposal(dealId, data),
    onSuccess: () => {
      toast.success("Proposal submitted")
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to submit proposal")
    },
  })
}

export function useSelectProposal(dealId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: string) => selectProposal(dealId, proposalId),
    onSuccess: () => {
      toast.success("Proposal selected")
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to select proposal")
    },
  })
}

export function useApproveProposal(dealId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: string) => approveProposal(dealId, proposalId),
    onSuccess: () => {
      toast.success("Proposal approved")
      void queryClient.invalidateQueries({ queryKey: dealKeys.all })
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to approve proposal")
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
    onSuccess: () => {
      toast.success("Activity created")
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to create activity")
    },
  })
}

export function useUpdateActivity(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateActivity(id, name),
    onSuccess: () => {
      toast.success("Activity updated")
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to update activity")
    },
  })
}

export function useDeleteActivity(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: () => {
      toast.success("Activity deleted")
      void queryClient.invalidateQueries({ queryKey: dealKeys.activities })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete activity")
    },
  })
}
