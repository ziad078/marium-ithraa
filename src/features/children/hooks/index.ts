import { useQuery } from "@tanstack/react-query"
import { getAllChildren } from "../api"

export function useAdminChildren() {
    return useQuery({
      queryKey: ["children"],
      queryFn: async () => {
        const res = await getAllChildren()
  
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || "Something went wrong")
        }
  
        return res.json()
      },
      staleTime: 1000 * 60 * 10,
    })
  }