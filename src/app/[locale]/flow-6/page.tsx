import { DiscoverChildIntelligenceCard } from "@/components/shared/cards/DiscoverChildIntelligenceCard"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Flow6Page({ params }: Props) {
  const { locale } = await params
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <main className="min-h-dvh pt-24 pb-16" dir={dir}>
      <div className="app-container flex justify-center">
        <DiscoverChildIntelligenceCard
          title={locale === "ar" ? "اكتشف ذكاء طفلك" : "Discover your child’s intelligence"}
          description={
            locale === "ar"
              ? "ابدأ الرحلة الذكية مع طفلك اليوم! اكتشف نوع ذكائه، وساعده على تنمية قدراته بطريقة تناسبه، بخطوات سهلة ونتائج فورية."
              : "Start the smart journey today—discover their strengths and help them grow with easy steps and instant results."
          }
          ctaLabel={locale === "ar" ? "اكتشف" : "Discover"}
        />
      </div>
    </main>
  )
}

