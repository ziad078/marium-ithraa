import Image from "next/image"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyEmail } from "@/features/auth"
import { Link } from "@/i18n/navigation"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}


export default async function VerifyEmailPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { token } = await searchParams
  const t = await getTranslations({ locale, namespace: "VerifyEmail" })

  const result = token ? await verifyEmail(token) : null

  if (result?.ok) {
    redirect(`/api/auth/verify-email/confirm?locale=${locale}`)
  }

  return (
    <main className="min-h-dvh pt-36 pb-16">
      <div className="app-container">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
          <Card className="mx-auto w-full max-w-md border-amber-50 shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={160}
                  height={48}
                  className="h-10 w-auto"
                  priority
                />
              </div>
              <CardTitle className="text-center text-2xl font-bold text-blue-500">
                {t("title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {!token ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {t("missingToken")}
                </div>
              ) : result?.ok ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
                  {result.message}
                </div>
              ) : (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {result?.message ?? t("failed")}
                </div>
              )}

              <Button
                asChild
                className="h-11 w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-95"
              >
                <Link href={`/auth/login`}>{t("goToLogin")}</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/20" />
              <div className="relative p-10">
                <Image
                  src="/hero.png"
                  alt="hero"
                  width={520}
                  height={520}
                  className="h-auto w-full"
                  priority
                />
                <p className="mt-6 text-lg font-semibold text-foreground">
                  {t("almostDone")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("onceVerified")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}