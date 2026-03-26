import { apiFetch as serverApiClient } from "@/lib/api-clent"
import { apiFetch as clientApiClient } from "@/lib/client-api-client"
import { Child } from "../types/interfaces"
import { Endpoint, Methods } from "@/lib/types/enums"

export const getChildren = async (userId: string) => {
  const response = await serverApiClient(`/${Endpoint.CHILDREN}?userId=${userId}`)
  const children = (await response.json())
  if (!response.ok) throw new Error("Failed to fetch children")
  console.log(children)
  return children
}

export const getAllChildren = async()=>{
  return clientApiClient(`/${Endpoint.CHILDREN}/${Endpoint.ALL}`)
}

export const createChild = async (data: Partial<Child>) => {
  console.log(data)
  return serverApiClient(`/${Endpoint.CHILDREN}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const updateChild = async (childId: string, data: Partial<Child>) => {
  return serverApiClient(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const deleteChild = async (childId: string) => {
  return serverApiClient(`/${Endpoint.CHILDREN}/${childId}`, {
    method: Methods.DELETE,
  })
}