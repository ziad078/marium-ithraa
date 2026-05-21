"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { IconPlus } from "@tabler/icons-react"

import { DataTable } from "@/components/shared/data-table/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { evaluationColumns } from "@/features/evaluations/components/columns"
import type { Evaluation, EvaluationType } from "@/features/evaluations/types"
import { EVALUATION_TYPE_LABELS } from "@/features/evaluations/utils/labels"
import { Link } from "@/i18n/navigation"
import { Pages, Routes } from "@/lib/types/enums"

type Props = {
  evaluations: Evaluation[]
  locale: string
}

const ALL_TYPES = "all"

export function AdminEvaluationsScreen({ evaluations, locale }: Props) {
  const t = useTranslations("Features.Evaluations")
  const isAr = locale === "ar"
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES)

  const filtered = useMemo(() => {
    return evaluations.filter((ev) => {
      const matchesSearch = ev.title
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchesType =
        typeFilter === ALL_TYPES || ev.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [evaluations, search, typeFilter])

  return (
    <div className="space-y-4 px-4 lg:px-6" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t("listTitle")}</h2>
        <Link href={`/${Routes.DASHBOARDS}/${Pages.ADMIN}/evaluations/create`}>
          <Button variant="outline" size="sm">
            <IconPlus className="size-4" />
            <span className="hidden lg:inline">{t("create")}</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={t("filterByType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>{t("allTypes")}</SelectItem>
            {(Object.keys(EVALUATION_TYPE_LABELS) as EvaluationType[]).map(
              (type) => (
                <SelectItem key={type} value={type}>
                  {isAr
                    ? EVALUATION_TYPE_LABELS[type].ar
                    : EVALUATION_TYPE_LABELS[type].en}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {t("empty")}
        </p>
      ) : (
        <DataTable data={filtered} columns={evaluationColumns} />
      )}
    </div>
  )
}
