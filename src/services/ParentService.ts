import { api } from "@/lib/api/api"
import { Endpoint, Methods } from "@/lib/types/enums"
import {
  Child,
  ChildTransferRequest,
  CreateChildFlowPayload,
  CreateChildResponse,
  CreatePrivateChildPayload,
  ParentSearchResult,
  TransferRequestResponse,
} from "@/features/children"
import { normalizeChild } from "@/lib/helpers/data-normalizers"

export const ParentService = {
  async getPrivateChildren(): Promise<Child[]> {
    const response = await api.client<Child[]>(
      `/${Endpoint.PARENT}/${Endpoint.CHILDREN}`,
    )
    return response.map(normalizeChild).filter(Boolean) as Child[]
  },

  async getOrgChildren(): Promise<Child[]> {
    const response = await api.client<Child[]>(
      `/${Endpoint.PARENT}/org-${Endpoint.CHILDREN}`,
    )
    return response.map(normalizeChild).filter(Boolean) as Child[]
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

  async createChildFlow(payload: CreateChildFlowPayload): Promise<CreateChildResponse> {
    return api.client<CreateChildResponse>(`/${Endpoint.CHILDREN}`, {
      method: Methods.POST,
      body: JSON.stringify(payload),
    })
  },

  async searchParentsByPhone(phone: string): Promise<ParentSearchResult> {
    return api.client<ParentSearchResult>(
      `/${Endpoint.PARENT}s/search?phone=${encodeURIComponent(phone)}`,
    )
  },

  async requestChildTransfer(
    childId: string,
    childType: import("@/lib/types/types/interfaces").ChildType,
    toOrganizationId: string,
  ): Promise<TransferRequestResponse> {
    return api.client<TransferRequestResponse>(`/${Endpoint.TRANSFERS}`, {
      method: Methods.POST,
      body: JSON.stringify({ childId, childType, toOrganizationId }),
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
