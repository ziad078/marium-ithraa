"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useLocale } from "next-intl"
import { toast } from "sonner"

import { clearAuthTokenCache } from "@/lib/api/client-api-client"

import { useAuth } from "./useAuth"

/**
 * Runs once per app load to handle expired refresh tokens and sync API token cache.
 */
export function useInitAuth() {
  const locale = useLocale()
  const { status } = useSession()
  const { logout, sessionExpired, session } = useAuth()
  const handledExpiry = useRef(false)

  useEffect(() => {
    if (status === "loading") return

    if (sessionExpired && session?.user && !handledExpiry.current) {
      handledExpiry.current = true
      clearAuthTokenCache()
      toast.error(
        locale === "ar"
          ? "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى."
          : "Your session has expired. Please sign in again.",
      )
      void logout({ silent: true })
      return
    }

    if (status === "authenticated") {
      clearAuthTokenCache()
    }
  }, [locale, status, sessionExpired, session?.user, logout])
}
