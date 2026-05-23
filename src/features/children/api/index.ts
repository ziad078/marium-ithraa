import { api } from "@/lib/api/api"
import { buildPaginationQuery, type PaginationParams } from "@/lib/api/pagination"
import {
  type Child,
  type CreateChildWithParentPayload,
  type CreatePrivateChildPayload,
  type UpdateChildPayload,
} from "../types/interfaces"
import { Endpoint, Methods } from "@/lib/types/enums"

export const getChildren = async (userId: string) => {
  return api.server<{ children: Child[] }>(
    `/${Endpoint.CHILDREN}?userId=${userId}`,
  )
}

export const getAllChildren = async () => {
  return api.client<{ children: Child[] }>(
    `/${Endpoint.CHILDREN}/${Endpoint.ALL}`,
  )
}

export const getAllChildrenServer = async (params?: PaginationParams) => {
  return api.server<{ children: Child[] }>(
    `/${Endpoint.CHILDREN}/${Endpoint.ALL}${buildPaginationQuery(params)}`,
  )
}

export const getAllChildrenByOrg = async (orgId: string) => {
  return api.server<{ children: Child[] }>(
    `/${Endpoint.CHILDREN}/organization/${orgId}`,
  )
}

export const getChildById = async (childId: string) => {
  return api.server<{ child: Child }>(`/${Endpoint.CHILDREN}/${childId}`)
}

export const createChild = async (data: Partial<Child> | CreateChildWithParentPayload) => {
  return api.server(`/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const updateChild = async (childId: string, data: UpdateChildPayload) => {
  return api.server(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteChild = async (childId: string) => {
  return api.server(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.DELETE,
  })
}

export const getPrivateChildren = async () => {
  return api.server<{ children: Child[] }>(`/${Endpoint.PARENT}/${Endpoint.CHILDREN}`)
}

export const getOrgChildren = async () => {
  return api.server<{ children: Child[] }>(`/${Endpoint.PARENT}/org-${Endpoint.CHILDREN}`)
}

export const createPrivateChild = async (data: CreatePrivateChildPayload) => {
  return api.server(`/${Endpoint.PARENT}/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}
