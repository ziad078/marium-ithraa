import { UserRole } from "@/lib/types/enums"
import { Child } from "@/features/children"

export function isChildOwnedByUser(child: Child, userId?: string): boolean {
  if (!userId) {
    return false
  }

  return (
    child.parentUserId === userId || child.parent?.userId === userId
  )
}

export function isUserParent(user?: {
  role?: string
  roles?: { name?: string }[]
}): boolean {
  return (
    user?.role === UserRole.PARENT ||
    Boolean(user?.roles?.some((role) => role.name === UserRole.PARENT))
  )
}

export function isUserOrganizationOwner(user?: {
  role?: string
  roles?: { name?: string }[]
}): boolean {
  return (
    user?.role === UserRole.ORGANIZATIONOWNER ||
    Boolean(
      user?.roles?.some((role) => role.name === UserRole.ORGANIZATIONOWNER),
    )
  )
}
