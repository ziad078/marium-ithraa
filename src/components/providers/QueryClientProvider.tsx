"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"

import { AuthInit } from "@/features/auth/components/AuthInit"
import { TooltipProvider } from "../ui/tooltip"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <AuthInit />
          <TooltipProvider>{children}</TooltipProvider>
        </SessionProvider>
    </QueryClientProvider>
  )
}