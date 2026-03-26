import { Endpoint, Methods } from "@/lib/types/enums"
import { Test } from "../types/interfaces"
import { apiFetch as serverApiFetch } from "@/lib/api-clent"
import { apiFetch as clientApiFetch } from "@/lib/client-api-client"

export const getAllTests = async () => {
    return clientApiFetch(`/${Endpoint.TESTS}`)
}

export const createTest = async (data: Partial<Test>) => {
    return serverApiFetch(`/${Endpoint.TESTS}`,{method: Methods.POST, body: JSON.stringify(data)})
}