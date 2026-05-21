import { api } from "@/lib/api/api"
// import { Endpoint } from "@/lib/types/enums"
import { Teacher } from "../types"
import { Endpoint, Methods } from "@/lib/types/enums"

export const getTeachersByOrg = async (orgId: string) => {
    return api.server<{teachers: Teacher[]}>(`/teachers/organization/${orgId}`)
}

export const createTeacher = async (data: Partial<Teacher>) => {
  return api.server(`/${Endpoint.TEACHERS}`, {method: Methods.POST, body: JSON.stringify(data)})
}

export const deleteTeacher = async (teacherId: string) => {
    return api.server(`/${Endpoint.USERS}/${teacherId}`, {
      method: Methods.DELETE,
    })
  }