import { UserRole } from "@/lib/types/enums"
import { Child } from "@/features/children"

/**
 * Check if a child belongs to a user.
 * parentId = ParentProfile.id (NOT User.id), so we compare parent.userId.
 */
export function isChildOwnedByUser(child: Child, userId?: string): boolean {
  if (!userId) return false
  return child.parent?.userId === userId || child.parentUserId === userId
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

export function isUserEnricher(user?: {
  role?: string
  roles?: { name?: string }[]
}): boolean {
  return (
    user?.role === UserRole.ENRICHER ||
    Boolean(user?.roles?.some((role) => role.name === UserRole.ENRICHER))
  )
}
