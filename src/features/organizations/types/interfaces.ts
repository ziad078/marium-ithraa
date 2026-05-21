
import { ApprovalStatus, OrganizationType } from "@/lib/types/enums"




export type Organization = {
    id: string
    organizationName: string
    organizationType: OrganizationType
    approvaStatus: ApprovalStatus
  
  }