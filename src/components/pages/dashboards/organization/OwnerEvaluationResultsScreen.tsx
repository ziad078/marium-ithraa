"use client"

import { useState } from "react"
import { CalendarDays, Download, FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { ErrorCard } from "@/components/shared/cards/ErrorCard"
import { showErrorToast, showInfoToast, showSuccessToast } from "@/lib/toast/app-toast"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EmptyState } from "@/components/shared/management/EmptyState"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  OwnerClassEvaluationSummary,
  OwnerEvaluationReportsResponse,
} from "@/features/evaluations/api"
import {
  useOwnerClassEvaluationStatus,
  useOwnerClassEvaluationSummary,
  useOwnerEvaluationFilters,
  useOwnerEvaluationReports,
  useSendOwnerEvaluationReminder,
} from "@/features/evaluations/hooks"
import type { EvaluationType } from "@/features/evaluations/types"
import { getEvaluationTypeLabel } from "@/features/evaluations/utils/labels"
import { Link } from "@/i18n/navigation"
import { getDateLocale, getTextDirection } from "@/lib/i18n/locale-utils"
import { METRIC_VARIANTS, type MetricVariant } from "@/components/shared/dashboard/metric-variants"
import { cn } from "@/lib/utils"
import { getChildId } from "@/lib/types/types/interfaces"

type Props = { locale: string }

const metricVariants = METRIC_VARIANTS

function formatScore(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return String(value)
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return `${value}%`
}

function MetricCard({
  title,
  value,
  variant = "purple",
}: {
  title: string
  value: string
  variant?: keyof typeof metricVariants
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-0 shadow-sm",
        metricVariants[variant],
      )}
    >
      <CardContent className="p-5 text-center">
        <p className="text-lg font-bold leading-tight">{title}</p>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

function QueryError({ message, onRetry, retryLabel }: { message: string; onRetry: () => void; retryLabel: string }) {
  return (
    <div className="p-4">
      <ErrorCard message={message} retry={{ label: retryLabel, onClick: onRetry }} />
    </div>
  )
}

function FiltersBar({
  classId,
  evaluationId,
  onClassChange,
  onEvaluationChange,
  classes,
  evaluations,
  disabled,
}: {
  classId: string
  evaluationId: string
  onClassChange: (v: string) => void
  onEvaluationChange: (v: string) => void
  classes: { id: string; name: string }[]
  evaluations: {
    id: string
    title: string
    type: string
  }[]
  disabled?: boolean
}) {
  const t = useTranslations("Features.OrganizationEvaluations")
  const tEval = useTranslations("Features.Evaluations")

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-1">
        <label className="text-sm font-medium">{t("class")}</label>
        <Select
          value={classId || undefined}
          onValueChange={onClassChange}
          disabled={disabled || classes.length === 0}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder={t("selectClass")} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">{t("evaluation")}</label>
        <Select
          value={evaluationId || undefined}
          onValueChange={onEvaluationChange}
          disabled={disabled || evaluations.length === 0}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder={t("selectEvaluation")} />
          </SelectTrigger>
          <SelectContent>
            {evaluations.map((ev) => (
              <SelectItem key={ev.id} value={ev.id}>
                {ev.title}
                {` (${getEvaluationTypeLabel(ev.type as EvaluationType, tEval)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function ReportsTab({
  locale,
  evaluationId,
}: {
  locale: string
  evaluationId: string
}) {
  const t = useTranslations("Features.OrganizationEvaluations")
  const reportsQuery = useOwnerEvaluationReports(
    evaluationId || undefined,
  )

  const showPdfExportSoon = () => {
    showInfoToast(t, "pdfExportSoon")
  }

  const showExcelExportSoon = () => {
    showInfoToast(t, "excelExportSoon")
  }

  if (reportsQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (reportsQuery.isError) {
    return (
      <QueryError
        message={t("error")}
        onRetry={() => void reportsQuery.refetch()}
        retryLabel={t("retry")}
      />
    )
  }

  const reports = reportsQuery.data?.reports ?? []

  if (reports.length === 0) {
    return <EmptyState title={t("empty")} />
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <ReportCard
          key={`${report.classId}-${report.evaluationId ?? "none"}-${report.title}`}
          report={report}
          onPdfExport={showPdfExportSoon}
          onExcelExport={showExcelExportSoon}
          locale={locale}
        />
      ))}
    </section>
  )
}

function ReportCard({
  report,
  onPdfExport,
  onExcelExport,
  locale,
}: {
  report: OwnerEvaluationReportsResponse["reports"][number]
  onPdfExport: () => void
  onExcelExport: () => void
  locale: string
}) {
  const t = useTranslations("Features.OrganizationEvaluations")
  const dateLabel = report.reportDate
    ? new Date(report.reportDate).toLocaleDateString(getDateLocale(locale))
    : "—"

  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardContent
        className="space-y-3 p-4 text-right"
        dir={getTextDirection(locale)}
      >
        <p className="font-bold text-primary">{report.title}</p>
        <p className="text-sm text-muted-foreground">
          {t("class")}: {report.className}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("evaluation")}: {report.evaluationTitle}
        </p>
        <p className="flex items-center justify-end gap-1 text-sm text-primary/80">
          <span>
            {report.evaluatedCount} / {report.childrenCount} {t("childrenUnit")}
          </span>
          <FileText className="size-4 text-muted-foreground" />
        </p>
        <p className="flex items-center justify-end gap-1 text-sm text-primary/80">
          <span>{dateLabel}</span>
          <CalendarDays className="size-4 text-muted-foreground" />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="rounded-lg border-fuchsia-500/60 text-fuchsia-600"
            onClick={onExcelExport}
          >
            {t("downloadExcel")}
          </Button>
          <Button variant="gradient" className="rounded-lg" onClick={onPdfExport}>
            <Download className="size-4" />
            {t("downloadPdf")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultsTab({
  classId,
  evaluationId,
}: {
  classId: string
  evaluationId: string
}) {
  const t = useTranslations("Features.OrganizationEvaluations")
  const summaryQuery = useOwnerClassEvaluationSummary(classId, evaluationId)

  if (!classId || !evaluationId) {
    return (
      <p className="text-center text-sm text-muted-foreground py-12">
        {t("selectClassAndEvaluation")}
      </p>
    )
  }

  if (summaryQuery.isLoading) {
    return <ResultsTabSkeleton />
  }

  if (summaryQuery.isError) {
    return (
      <QueryError
        message={t("error")}
        onRetry={() => void summaryQuery.refetch()}
        retryLabel={t("retry")}
      />
    )
  }

  if (!summaryQuery.data) {
    return <EmptyState title={t("empty")} />
  }

  return (
    <ResultsTabContent summary={summaryQuery.data} />
  )
}

function ResultsTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function ResultsTabContent({
  summary,
}: {
  summary: OwnerClassEvaluationSummary
}) {
  const t = useTranslations("Features.OrganizationEvaluations")
  const isLearningStyles = summary.evaluationType === "learning_styles"
  const topDims = summary.topDimensions ?? []

  const statCards = [
    {
      title: t("highestScore"),
      value: formatScore(summary.highestScore),
      variant: "purple" as const,
    },
    {
      title: t("averageScore"),
      value: formatScore(summary.averageScore),
      variant: "indigo" as const,
    },
    {
      title: t("lowestScore"),
      value: formatScore(summary.lowestScore),
      variant: "pink" as const,
    },
    {
      title: t("childrenCount"),
      value: String(summary.totalChildren),
      variant: "purple" as const,
    },
    {
      title: t("approved"),
      value: String(summary.approvedCount),
      variant: "indigo" as const,
    },
    {
      title: t("waitingApproval"),
      value: String(summary.submittedCount),
      variant: "pink" as const,
    },
    {
      title: t("inProgress"),
      value: String(summary.inProgressCount),
      variant: "purple" as const,
    },
    {
      title: t("notStarted"),
      value: String(summary.notStartedCount),
      variant: "indigo" as const,
    },
  ]

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-2xl font-bold text-right text-foreground">
          {t("classStats")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-2xl font-bold text-right text-foreground">
          {t("topDimensions")}
        </h3>
        {topDims.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            {t("noTopDimensions")}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {topDims.slice(0, 3).map((dim, idx) => (
              <MetricCard
                key={dim.code ?? idx}
                title={dim.name ?? dim.code ?? "—"}
                value={
                  dim.percentage != null
                    ? formatPercent(dim.percentage)
                    : formatScore(dim.score)
                }
                variant={
                  idx === 0 ? "purple" : idx === 1 ? "indigo" : "pink"
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-2xl font-bold text-right text-foreground">
          {t("childrenResults")}
        </h3>
        {summary.children.length === 0 ? (
          <EmptyState title={t("empty")} />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {summary.children.map((child) => (
              <ChildResultCard
                key={getChildId(child) ?? child.childName}
                isLearningStyles={isLearningStyles}
                child={child}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ChildResultCard({
  child,
  isLearningStyles,
}: {
  child: OwnerClassEvaluationSummary["children"][number]
  isLearningStyles: boolean
}) {
  const t = useTranslations("Features.OrganizationEvaluations")

  const resultLine = isLearningStyles
    ? [child.topResultLabel, child.topDimensionName]
        .filter(Boolean)
        .join(" · ") || "—"
    : formatScore(child.score)

  const content = (
    <Card className="rounded-2xl border bg-white shadow-sm h-full">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="size-14 rounded-xl shrink-0">
            <AvatarImage
              src="/avatar-placeholder.svg"
              alt={child.childName}
              className="rounded-xl object-cover"
            />
            <AvatarFallback className="rounded-xl text-xs">CH</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-right text-xs space-y-1">
            <p className="font-semibold text-primary truncate">
              {child.childName}
            </p>
            <p className="text-muted-foreground truncate">{child.className}</p>
            <Badge variant="secondary" className="text-[10px]">
              {child.statusLabel}
            </Badge>
            <p className="text-primary/90">
              {isLearningStyles ? t("result") : t("score")}: {resultLine}
            </p>
            {!isLearningStyles && child.topDimensionName && (
              <p className="text-muted-foreground">
                {child.topDimensionName}
                {child.topDimensionPercentage != null
                  ? ` (${formatPercent(child.topDimensionPercentage)})`
                  : ""}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (child.attemptId) {
    return (
      <Link
        href={`/dashboards/organization/attempts/${child.attemptId}`}
        className="block transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    )
  }

  return content
}

function StatusTab({
  locale,
  classId,
  evaluationId,
}: {
  locale: string
  classId: string
  evaluationId: string
}) {
  const t = useTranslations("Features.OrganizationEvaluations")
  const statusQuery = useOwnerClassEvaluationStatus(classId, evaluationId)
  const reminderMutation = useSendOwnerEvaluationReminder(
    classId,
    evaluationId,
  )

  if (!classId || !evaluationId) {
    return (
      <p className="text-center text-sm text-muted-foreground py-12">
        {t("selectClassAndEvaluation")}
      </p>
    )
  }

  if (statusQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (statusQuery.isError) {
    return (
      <QueryError
        message={t("error")}
        onRetry={() => void statusQuery.refetch()}
        retryLabel={t("retry")}
      />
    )
  }

  const children = statusQuery.data?.children ?? []

  if (children.length === 0) {
    return <EmptyState title={t("empty")} />
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {children.map((item) => (
        <StatusChildCard
          key={getChildId(item) ?? item.childName}
          item={item}
          isPending={reminderMutation.isPending}
          onReminder={async () => {
            try {
              await reminderMutation.mutateAsync(getChildId(item)!)
              showSuccessToast(
                { raw: locale === "ar"
                  ? "تم إرسال التذكير بنجاح"
                  : t("reminderSuccess") }
              )
            } catch (e: unknown) {
              showErrorToast({ raw: e instanceof Error ? e.message : t("error") })
            }
          }}
        />
      ))}
    </section>
  )
}

function StatusChildCard({
  item,
  onReminder,
  isPending,
}: {
  item: {
    organizationChildId: string | null
    privateChildId: string | null
    childName: string
    className: string
    statusLabel: string
    canSendReminder: boolean
  }
  onReminder: () => void
  isPending: boolean
}) {
  const t = useTranslations("Features.OrganizationEvaluations")

  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-16 rounded-xl shrink-0">
            <AvatarImage
              src="/avatar-placeholder.svg"
              alt={item.childName}
              className="rounded-xl object-cover"
            />
            <AvatarFallback className="rounded-xl text-xs">CH</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-right text-sm space-y-1">
            <p className="font-semibold text-primary truncate">{item.childName}</p>
            <p className="text-muted-foreground truncate">{item.className}</p>
            <p className="font-medium text-emerald-600">{item.statusLabel}</p>
          </div>
        </div>
        <Button variant="gradient"
          className="h-9 w-full rounded-lg"
          disabled={!item.canSendReminder || isPending}
          onClick={onReminder}
        >
          {t("sendReminder")}
        </Button>
      </CardContent>
    </Card>
  )
}

export function OwnerEvaluationResultsScreen({ locale }: Props) {
  const t = useTranslations("Features.OrganizationEvaluations")
  const tCommon = useTranslations("Dashboard.common")

  const filtersQuery = useOwnerEvaluationFilters()
  const [classId, setClassId] = useState<string | null>(null)
  const [evaluationId, setEvaluationId] = useState<string | null>(null)

  const classes = filtersQuery.data?.classes ?? []
  const evaluations = filtersQuery.data?.evaluations ?? []

  const effectiveClassId = classId ?? classes[0]?.id ?? ""
  const effectiveEvaluationId = evaluationId ?? evaluations[0]?.id ?? ""

  const filtersReady = !filtersQuery.isLoading && !filtersQuery.isError

  return (
    <main
      className="min-h-screen bg-surface py-8 space-y-8"
      dir={getTextDirection(locale)}
    >
      <div className="app-container space-y-6">
        <ManagementPageHeader
          breadcrumbs={[
            {
              href: "/dashboards/organization",
              label: tCommon("home"),
            },
            { label: t("results") },
          ]}
          title={t("results")}
          subtitle={t("subtitle")}
        />

        {filtersQuery.isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
        ) : filtersQuery.isError ? (
          <QueryError
            message={t("error")}
            onRetry={() => void filtersQuery.refetch()}
            retryLabel={t("retry")}
          />
        ) : (
          <FiltersBar
            classId={effectiveClassId}
            evaluationId={effectiveEvaluationId}
            onClassChange={setClassId}
            onEvaluationChange={setEvaluationId}
            classes={classes}
            evaluations={evaluations}
          />
        )}

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-3 bg-transparent p-0">
            <TabsTrigger
              value="reports"
              className="h-11 rounded-xl bg-white/80 text-base data-[state=active]:bg-surface-accent data-[state=active]:shadow"
            >
              {t("reportsTab")}
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="h-11 rounded-xl bg-white/80 text-base data-[state=active]:bg-surface-accent data-[state=active]:shadow"
            >
              {t("resultsTab")}
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="h-11 rounded-xl bg-white/80 text-base data-[state=active]:bg-surface-accent data-[state=active]:shadow"
            >
              {t("statusTab")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="pt-6">
            {filtersReady ? (
              <ReportsTab locale={locale} evaluationId={effectiveEvaluationId} />
            ) : null}
          </TabsContent>

          <TabsContent value="results" className="pt-6">
            {filtersReady ? (
              <ResultsTab
                classId={effectiveClassId}
                evaluationId={effectiveEvaluationId}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="status" className="pt-6">
            {filtersReady ? (
              <StatusTab
                locale={locale}
                classId={effectiveClassId}
                evaluationId={effectiveEvaluationId}
              />
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
