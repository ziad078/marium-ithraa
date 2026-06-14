import { api } from "@/lib/api/api"
import { Endpoint, Methods } from "@/lib/types/enums"
import {
  Child,
  ChildTransferRequest,
  CreateChildFlowPayload,
  CreateChildResponse,
  CreateChildWithParentPayload,
  CreatePrivateChildPayload,
  ParentSearchResult,
  TransferRequestResponse,
  UpdateChildPayload,
} from "@/features/children"
import { normalizeChild } from "@/lib/helpers/data-normalizers"

export const ChildrenService = {
  async getChildren(userId: string): Promise<Child[]> {
    const response = await api.client<{ children: Child[] }>(
      `/${Endpoint.CHILDREN}?userId=${encodeURIComponent(userId)}`,
    )
    return response.children.map(normalizeChild).filter(Boolean) as Child[]
  },

  async getAllChildren(): Promise<Child[]> {
    const response = await api.client<{ children: Child[] }>(
      `/${Endpoint.CHILDREN}/${Endpoint.ALL}`,
    )
    return response.children.map(normalizeChild).filter(Boolean) as Child[]
  },

  async getAllChildrenByOrg(orgId: string): Promise<Child[]> {
    const response = await api.client<{ children: Child[] }>(
      `/${Endpoint.CHILDREN}/organization/${encodeURIComponent(orgId)}`,
    )
    return response.children.map(normalizeChild).filter(Boolean) as Child[]
  },

  async getChildById(childId: string): Promise<Child> {
    const response = await api.client<{ child: Child }>(
      `/${Endpoint.CHILDREN}/${encodeURIComponent(childId)}`,
    )
    return normalizeChild(response.child) as Child
  },

  async createChild(
    data: Partial<Child> | CreateChildWithParentPayload,
  ): Promise<unknown> {
    return api.client(`/${Endpoint.CHILDREN}`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    })
  },

  async updateChild(childId: string, data: UpdateChildPayload): Promise<Child> {
    const response = await api.client<Child>(
      `/${Endpoint.CHILDREN}/${encodeURIComponent(childId)}`,
      {
        method: Methods.PATCH,
        body: JSON.stringify(data),
      },
    )
    return normalizeChild(response) as Child
  },

  async deleteChild(childId: string): Promise<void> {
    await api.client(`/${Endpoint.CHILDREN}/${encodeURIComponent(childId)}`, {
      method: Methods.DELETE,
    })
  },

  async createChildFlow(payload: CreateChildFlowPayload): Promise<CreateChildResponse> {
    return api.client<CreateChildResponse>(`/${Endpoint.CHILDREN}`, {
      method: Methods.POST,
      body: JSON.stringify(payload),
    })
  },

  async getPrivateChildren(): Promise<Child[]> {
    const response = await api.client<{ children: Child[] }>(
      `/${Endpoint.PARENT}/${Endpoint.CHILDREN}`,
    )
    return response.children.map(normalizeChild).filter(Boolean) as Child[]
  },

  async getOrgChildren(): Promise<Child[]> {
    const response = await api.client<{ children: Child[] }>(
      `/${Endpoint.PARENT}/org-${Endpoint.CHILDREN}`,
    )
    return response.children.map(normalizeChild).filter(Boolean) as Child[]
  },

  async createPrivateChild(
    payload: CreatePrivateChildPayload,
  ): Promise<Child> {
    const response = await api.client<Child>(`/${Endpoint.PARENT}/${Endpoint.CHILDREN}`, {
      method: Methods.POST,
      body: JSON.stringify(payload),
    })
    return normalizeChild(response) as Child
  },

  async searchParentsByPhone(phone: string): Promise<ParentSearchResult> {
    return api.client<ParentSearchResult>(
      `/${Endpoint.PARENT}s/search?phone=${encodeURIComponent(phone)}`,
    )
  },

  async requestChildTransfer(
    childId: string,
    toOrganizationId: string,
  ): Promise<TransferRequestResponse> {
    return api.client<TransferRequestResponse>(`/${Endpoint.TRANSFERS}`, {
      method: Methods.POST,
      body: JSON.stringify({ childId, toOrganizationId }),
    })
  },

  async getChildTransferRequests(
    fromOrganizationId: string,
  ): Promise<ChildTransferRequest[]> {
    const response = await api.client<{
      requests?: ChildTransferRequest[]
      transferRequests?: ChildTransferRequest[]
      childTransfers?: ChildTransferRequest[]
    }>(
      `/${Endpoint.TRANSFERS}?fromOrganizationId=${encodeURIComponent(
        fromOrganizationId,
      )}&status=pending`,
    )

    return (
      response.requests ?? response.transferRequests ?? response.childTransfers ?? []
    )
  },

  async approveChildTransfer(
    requestId: string,
    classId: string,
  ): Promise<TransferRequestResponse> {
    return api.client<TransferRequestResponse>(
      `/${Endpoint.TRANSFERS}/${encodeURIComponent(requestId)}/${Endpoint.APPROVE}`,
      {
        method: Methods.PATCH,
        body: JSON.stringify({ classId }),
      },
    )
  },

  async rejectChildTransfer(requestId: string): Promise<TransferRequestResponse> {
    return api.client<TransferRequestResponse>(
      `/${Endpoint.TRANSFERS}/${encodeURIComponent(requestId)}/${Endpoint.REJECT}`,
      {
        method: Methods.PATCH,
      },
    )
  },
}
