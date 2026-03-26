import { useQuery } from "@tanstack/react-query"
import { getAllTests } from "../api"

export function useAdminTests() {
  return useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const res = await getAllTests()
      return res.json()
    },
    staleTime: 1000 * 60 * 10,
  })
}
