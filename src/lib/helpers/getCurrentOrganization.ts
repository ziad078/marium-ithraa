import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

import {
  getMyOrganizationServer,
  getUserOrganization,
} from "@/features/organizations/api"
import type { Organization } from "@/features/organizations/types/interfaces"
import { ApprovalStatus } from "@/lib/types/enums"
import nextAuthOptions from "@/server/auth"

export const getCurrentOrganization = async (): Promise<Organization | null> => {
  const session = await getServerSession(nextAuthOptions)
  if (!session?.user?.id) return null

  try {
    return await getMyOrganizationServer()
  } catch {
    const legacy = await getUserOrganization(session.user.id).catch(() => null)
    const org = legacy?.user?.organization
    if (!org?.id) return null

    return {
      id: org.id,
      organizationName: org.organizationName,
      organizationType: org.organizationType,
      approvalStatus: org.approvalStatus ?? ApprovalStatus.PENDING,
      rejectionReason: org.rejectionReason ?? null,
    }
  }
}

export async function requireCurrentOrganization(): Promise<Organization> {
  const organization = await getCurrentOrganization()
  if (!organization) notFound()
  return organization
}

export function isOrganizationApproved(
  organization: Organization | null | undefined,
): organization is Organization {
  return organization?.approvalStatus === ApprovalStatus.APPROVED
}
