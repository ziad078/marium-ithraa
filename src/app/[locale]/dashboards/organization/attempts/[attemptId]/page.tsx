import { OwnerAttemptResultScreen } from "@/components/pages/dashboards/organization/OwnerAttemptResultScreen"

type Props = {
  params: Promise<{ locale: string; attemptId: string }>
}

export default async function OwnerAttemptResultPage({ params }: Props) {
  const { locale } = await params
  return <OwnerAttemptResultScreen locale={locale} />
}
