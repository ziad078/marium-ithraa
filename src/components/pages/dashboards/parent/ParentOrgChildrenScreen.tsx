"use client"

import { Baby, Calendar } from "lucide-react"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EmptyState } from "@/components/shared/management/EmptyState"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Child } from "@/features/children"
import {
  formatChildBirthDate,
  getChildEvaluationLabel,
} from "@/features/children/utils/display"
import { Link } from "@/i18n/navigation"

type Props = {
  locale: string
  orgChildren: Child[]
}

export function ParentOrgChildrenScreen({ locale, orgChildren }: Props) {
  const isAr = locale === "ar"

  const title = isAr ? "اطفال المؤسسة" : "Organization children"

  return (
    <main className="app-container py-8 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/parent", label: isAr ? "الرئيسية" : "Home" },
          { label: title },
        ]}
        title={title}
        subtitle={
          isAr
            ? `يمكنك اضافة الاطفال التابعين لمؤسستك من هنا`
            : `You can evaluate your organization children here`
        }
      />


      {orgChildren.length === 0 ? (
        <EmptyState
          title={isAr ? "لا يوجد أطفال بعد" : "No children yet"}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {orgChildren.map((child) => {
            const evalInfo = getChildEvaluationLabel(child, isAr)
            return (
              <Card key={child.id} className="rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Baby className="text-fuchsia-600 size-4" />
                    {child.name}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatChildBirthDate(child.birthDate, locale)}
                  </p>
                  <p className="text-sm">
                    {isAr ? "المحاولات" : "Attempts"}: {child.attemptsUsed ?? 0}
                  </p>
                  <p className="text-sm">
                    {isAr ? "إعادة التقييم" : "Retake"}:{" "}
                    {child.retakeUsed
                      ? isAr
                        ? "نعم"
                        : "Yes"
                      : isAr
                        ? "لا"
                        : "No"}
                  </p>
                  <p className={`text-sm font-medium ${evalInfo.className}`}>
                    {evalInfo.label}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 rounded-xl" asChild>
                    <Link
                      href={`/dashboards/parent/children/${child.id}/evaluations`}
                    >
                      {isAr ? "التقييمات" : "Evaluations"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}
    </main>
  )
}
