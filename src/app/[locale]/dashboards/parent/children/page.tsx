import { ParentOrgChildrenScreen } from "@/components/pages/dashboards/parent/ParentOrgChildrenScreen"
import { ParentPrivateChildrenScreen } from "@/components/pages/dashboards/parent/ParentPrivateChildrenScreen"
import { getOrgChildren, getPrivateChildren } from "@/features/children"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ParentChildrenPage({ params }: Props) {
  const { locale } = await params
  const { children:privateChildren } = await getPrivateChildren()
  const { children:orgChildren } = await getOrgChildren()
  console.log(orgChildren, privateChildren)
  return (<>
  <ParentPrivateChildrenScreen locale={locale} privateChildren={privateChildren} />
  <ParentOrgChildrenScreen locale={locale} orgChildren={orgChildren} />
  </>)
}
