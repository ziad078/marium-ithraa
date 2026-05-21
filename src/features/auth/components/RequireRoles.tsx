import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import nextAuthOptions from "@/server/auth"
import { Routes } from "@/lib/types/enums"
import { hasAnyRole } from "@/features/auth/utils/rbac"
import type { UserRole } from "@/lib/types/enums"

export default async function RequireRoles({
  children,
  allowed,
  redirectTo,
}: {
  children: ReactNode
  allowed: UserRole[]
  redirectTo?: string
}) {
  const session = await getServerSession(nextAuthOptions)
  if (!session?.user) redirect(redirectTo ?? `/${Routes.AUTH}/login`)

  const ok = hasAnyRole(session.user.roles, allowed)
  if (!ok) redirect(redirectTo ?? `/${Routes.UNAUTHARIZED}`)

  return children
}

