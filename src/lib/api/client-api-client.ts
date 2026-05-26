import { getSession, signOut } from "next-auth/react"

import { ApiError } from "../errors/ApiError"
import type { ValidationErrors } from "../types/types"
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

function getApiErrorMessage(data: unknown) {
  if (typeof data === "string") return data

  if (typeof data !== "object" || data === null) return "Request failed"

  const maybeMessage = (data as { message?: unknown }).message
  if (typeof maybeMessage === "string") return maybeMessage
  if (Array.isArray(maybeMessage)) {
    return maybeMessage.filter((item): item is string => typeof item === "string").join(", ")
  }

  const maybeErrors = (data as { errors?: unknown }).errors
  if (typeof maybeErrors === "object" && maybeErrors !== null) {
    const messages = Object.values(maybeErrors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === "string")

    if (messages.length > 0) return messages.join(", ")
  }

  return "Request failed"
}

function getValidationErrors(data: unknown): ValidationErrors | undefined {
  if (typeof data !== "object" || data === null) return undefined

  const maybeErrors = (data as { errors?: unknown }).errors ?? data
  if (typeof maybeErrors !== "object" || maybeErrors === null) return undefined

  const errors = Object.entries(maybeErrors).reduce<ValidationErrors>(
    (acc, [key, value]) => {
      if (Array.isArray(value)) {
        const messages = value.filter((item): item is string => typeof item === "string")
        if (messages.length > 0) acc[key] = messages
        return acc
      }

      if (typeof value === "string") acc[key] = [value]
      return acc
    },
    {},
  )

  return Object.keys(errors).length > 0 ? errors : undefined
}

export async function clientApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> {
  const token = await resolveAccessToken()

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`, {
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
    throw new ApiError(getApiErrorMessage(data), res.status, getValidationErrors(data))
  }

  return data as T
}
