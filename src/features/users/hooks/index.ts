import { useQuery } from "@tanstack/react-query"
import { getUsersInRoles } from "../api"

export function useAdminUsersInRoles() {
    return useQuery({
      queryKey: ["users-in-roles"],
      queryFn: async () => {
        const res = await getUsersInRoles()
  
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || "Something went wrong")
        }
  
        return res.json()
      },
      staleTime: 1000 * 60 * 10,
    })
  }