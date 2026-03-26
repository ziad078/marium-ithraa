import { useQuery } from "@tanstack/react-query"
import { getAllOrganizations, getUserOrganization } from "../api"

export function useOrganization(userId?: string) {
  return useQuery({
    queryKey: ["organization", userId],
    queryFn: async () => {
      const res = await getUserOrganization(userId!)
      return res.json()
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  })
}
export function useAdminOrganization() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const res = await getAllOrganizations()

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Something went wrong")
      }

      return res.json()
    },
    staleTime: 1000 * 60 * 10,
  })
}