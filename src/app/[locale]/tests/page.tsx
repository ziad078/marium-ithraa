import RequireRoles from "@/features/auth/components/RequireRoles"
import { Link } from "@/i18n/navigation"
import { UserRole } from "@/lib/types/enums"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TestsPage({ params }: Props) {
  const { locale } = await params
  const isAr = locale === "ar"

  return (
    <RequireRoles allowed={[UserRole.PARENT]} redirectTo="/unautharized">
      <main
        className="app-container flex min-h-[60vh] items-center justify-center py-16"
        dir={isAr ? "rtl" : "ltr"}
      >
        <section className="max-w-xl space-y-4 rounded-2xl border border-border/60 bg-background p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            This tests flow is no longer available. Please use evaluations.
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAr
              ? "تم إيقاف واجهة الاختبارات القديمة. يمكنك متابعة تقييمات الأطفال من صفحة التقييمات."
              : "The legacy tests interface has been retired. Child assessments now live in evaluations."}
          </p>
          <Link
            href="/dashboards/parent/evaluations"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            {isAr ? "فتح التقييمات" : "Open evaluations"}
          </Link>
        </section>
      </main>
    </RequireRoles>
  )
}
