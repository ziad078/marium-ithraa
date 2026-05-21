import { getSession, signOut } from "next-auth/react"

import { ApiError } from "../errors/ApiError"
import { Pages, Routes, StatusCode } from "../types/enums"

let cachedToken: string | null = null

export function clearAuthTokenCache() {
  cachedToken = null
}

export function setAuthTokenCache(token: string | null) {
  cachedToken = token
}

export function getCachedAuthToken() {
  return cachedToken
}

async function resolveAccessToken(): Promise<string | null> {
  const session = await getSession()

  if (session?.error === "RefreshAccessTokenError") {
    clearAuthTokenCache()
    await signOut({
      callbackUrl: `/${Routes.AUTH}/${Pages.LOGIN}`,
      redirect: true,
    })
    return null
  }

  const token = session?.user?.accessToken ?? null
  cachedToken = token
  return token
}

export async function clientApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> {
  const token = await resolveAccessToken()

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (res.status === StatusCode.UNAUTHARIZED) {
    clearAuthTokenCache()

    if (retryOnUnauthorized) {
      const refreshed = await resolveAccessToken()
      if (refreshed && refreshed !== token) {
        return clientApiFetch<T>(endpoint, options, false)
      }
    }

    await signOut({
      callbackUrl: `/${Routes.AUTH}/${Pages.LOGIN}`,
      redirect: true,
    })
    throw new ApiError("Unauthorized", StatusCode.UNAUTHARIZED)
  }

  let data: unknown
  try {
    data = await res.json()
  } catch {
    throw new ApiError("Invalid server response", StatusCode.INTERNALSERVERERROR)
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Request failed"
    throw new ApiError(message, res.status)
  }

  return data as T
}
