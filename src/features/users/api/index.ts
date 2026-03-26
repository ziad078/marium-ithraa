import { apiFetch as clientApiClient } from "@/lib/client-api-client"
import { Endpoint } from "@/lib/types/enums"

export const getUsersInRoles = ()=>{
    return clientApiClient(`/${Endpoint.USERS}/${Endpoint.ROLES}`)
}