import { CreateEmployee } from "@/features/employees/types/interfaces"
import { Endpoint, Methods } from "@/lib/types/enums"
import { api } from "@/lib/api/api"
import { User } from "@/features/users"
import type {
  ApprovalStatus,
  Organization,
  OrganizationsListResponse,
  RejectOrganizationPayload,
} from "../types/interfaces"

export const createEmployee = async (employee: CreateEmployee) => {
  return api.server(`/${Endpoint.EMPLOYEES}`, {
    method: Methods.POST,
    body: JSON.stringify(employee),
  })
}

/** @deprecated Use getMyOrganization instead */
export async function getUserOrganization(userId: string) {
  return api.server<{ user: User }>(
    `/${Endpoint.USERS}/${Endpoint.ORGANIZATIONOWNER}/${userId}`,
  )
}

export async function getMyOrganization() {
  return api.client<Organization>(`/${Endpoint.ORGANIZATIONS}/${Endpoint.ME}`)
}

export async function getMyOrganizationServer() {
  return api.server<Organization>(`/${Endpoint.ORGANIZATIONS}/${Endpoint.ME}`)
}

export async function getAllOrganizations() {
  return api.client<OrganizationsListResponse>(`/${Endpoint.ORGANIZATIONS}`)
}

export async function getPendingOrganizations() {
  return api.client<OrganizationsListResponse>(
    `/${Endpoint.ORGANIZATIONS}/${Endpoint.PENDING}`,
  )
}

export async function getOrganizationsByStatus(status: ApprovalStatus) {
  return api.client<OrganizationsListResponse>(
    `/${Endpoint.ORGANIZATIONS}?status=${status}`,
  )
}

export async function approveOrganization(id: string) {
  return api.client<Organization>(
    `/${Endpoint.ORGANIZATIONS}/${id}/${Endpoint.APPROVE}`,
    { method: Methods.PATCH },
  )
}

export async function rejectOrganization(id: string, body: RejectOrganizationPayload) {
  return api.client<Organization>(
    `/${Endpoint.ORGANIZATIONS}/${id}/${Endpoint.REJECT}`,
    {
      method: Methods.PATCH,
      body: JSON.stringify(body),
    },
  )
}
