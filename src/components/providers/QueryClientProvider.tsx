"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "../ui/tooltip"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TooltipProvider>
            
            {children}

          </TooltipProvider>
        </SessionProvider>
    </QueryClientProvider>
  )
}