import { ChildTransferRequestsScreen } from "@/components/pages/dashboards/organization/ChildTransferRequestsScreen"
import { getChildTransferRequests } from "@/features/children"
import { getCurrentOrganization } from "@/lib/helpers/getCurrentOrganization"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ChildTransferRequestsPage({ params }: Props) {
  const { locale } = await params
  const org = await getCurrentOrganization()
  const orgId = org.user.organization.id
  const response = await getChildTransferRequests(orgId)

  return (
    <ChildTransferRequestsScreen
      locale={locale}
      requests={response.requests}
    />
  )
}
