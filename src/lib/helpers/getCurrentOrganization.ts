import { getUserOrganization } from "@/features/organizations"
import nextAuthOptions from "@/server/auth"
import { getServerSession } from "next-auth"

export const getCurrentOrganization = async () => {
    const session = await getServerSession(nextAuthOptions)
    console.log("session .user>>>",session?.user)
    console.log("get org=>>>",await getUserOrganization(session?.user?.id||""))
    return getUserOrganization(session?.user?.id||"")
  }