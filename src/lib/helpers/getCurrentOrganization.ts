import { getUserOrganization } from "@/features/organizations"
import nextAuthOptions from "@/server/auth"
import { getServerSession } from "next-auth"

export const getCurrentOrganization = async () => {
  console.log("i'am the error")
    const session = await getServerSession(nextAuthOptions)
  console.log("i'am the error33")
    console.log(session)
    console.log(getUserOrganization(session?.user?.id||""))
    return getUserOrganization(session?.user?.id||"")
  }