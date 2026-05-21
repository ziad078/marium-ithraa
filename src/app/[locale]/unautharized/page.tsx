"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Routes } from "@/lib/types/enums"

export default function UnautharizedPage() {
  const t = useTranslations()

  return (
    <main className="min-h-dvh pt-24 pb-16">
      <div className="app-container">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>{t("Common.unauthorizedTitle", { defaultMessage: "Access denied" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("Common.unauthorizedBody", {
                defaultMessage: "You don’t have permission to view this page.",
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="default">
                <Link href={`/${Routes.DASHBOARDS}`}>{t("Common.goToDashboard", { defaultMessage: "Go to dashboard" })}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${Routes.AUTH}/login`}>{t("Common.goToLogin", { defaultMessage: "Go to login" })}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

