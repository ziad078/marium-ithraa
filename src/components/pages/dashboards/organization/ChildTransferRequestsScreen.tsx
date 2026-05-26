"use client"

import { useMemo, useState, useTransition } from "react"
import type { ReactNode } from "react"
import { toast } from "sonner"
import { ArrowRightLeft, Calendar, Check, Loader2, School, X } from "lucide-react"

import { ManagementPageHeader } from "@/components/shared/management/ManagementPageHeader"
import { EmptyState } from "@/components/shared/management/EmptyState"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  approveChildTransfer,
  rejectChildTransfer,
  type ChildTransferRequest,
} from "@/features/children"
import { formatChildBirthDate, getChildClassName } from "@/features/children/utils/display"
import { getTextDirection } from "@/lib/i18n/locale-utils"

type Props = {
  locale: string
  requests: ChildTransferRequest[]
}

type PendingAction =
  | { type: "approve"; request: ChildTransferRequest }
  | { type: "reject"; request: ChildTransferRequest }
  | null

export function ChildTransferRequestsScreen({ locale, requests }: Props) {
  const [items, setItems] = useState(requests)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [isPending, startTransition] = useTransition()
  const isAr = locale === "ar"

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === "pending"),
    [items],
  )

  function completeAction() {
    if (!pendingAction) return

    startTransition(async () => {
      try {
        const response =
          pendingAction.type === "approve"
            ? await approveChildTransfer(pendingAction.request.id)
            : await rejectChildTransfer(pendingAction.request.id)

        setItems((current) =>
          current.filter((item) => item.id !== pendingAction.request.id),
        )
        toast.success(
          response.message ||
            (pendingAction.type === "approve"
              ? "Transfer request approved"
              : "Transfer request rejected"),
        )
        setPendingAction(null)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to update transfer request")
      }
    })
  }

  return (
    <main className="app-container py-8 space-y-8" dir={getTextDirection(locale)}>
      <ManagementPageHeader
        breadcrumbs={[
          { href: "/dashboards/organization", label: isAr ? "لوحة التحكم" : "Dashboard" },
          { label: isAr ? "طلبات النقل" : "Transfer requests" },
        ]}
        title={isAr ? "طلبات نقل الأطفال" : "Child transfer requests"}
        subtitle={
          isAr
            ? "راجع طلبات نقل الأطفال الواردة إلى مؤسستك واعتمدها من هنا."
            : "Review incoming child transfer requests for your organization."
        }
      />

      {pendingItems.length === 0 ? (
        <EmptyState title={isAr ? "لا توجد طلبات نقل معلقة" : "No pending transfer requests"} />
      ) : (
        <section className="grid gap-5 lg:grid-cols-2">
          {pendingItems.map((request) => {
            const child = request.child
            const fromName =
              request.fromOrganization?.organizationName ||
              request.fromOrganization?.name ||
              (isAr ? "مؤسسة أخرى" : "Another organization")
            const requestedBy = request.requestedBy?.name || request.requestedBy?.phone

            return (
              <Card key={request.id} className="rounded-xl">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {child?.name || (isAr ? "طفل غير معروف" : "Unknown child")}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isAr ? "طلب نقل وارد" : "Incoming transfer request"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <ArrowRightLeft className="size-3" />
                      {isAr ? "معلق" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <TransferField
                      icon={<School />}
                      label={isAr ? "من مؤسسة" : "From organization"}
                      value={fromName}
                    />
                    <TransferField
                      icon={<Calendar />}
                      label={isAr ? "تاريخ الميلاد" : "Birth date"}
                      value={formatChildBirthDate(child?.birthDate, locale)}
                    />
                    <TransferField
                      label={isAr ? "الفصل" : "Class"}
                      value={child ? getChildClassName(child) : "-"}
                    />
                    {requestedBy ? (
                      <TransferField
                        label={isAr ? "مقدم الطلب" : "Requested by"}
                        value={requestedBy}
                      />
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      type="button"
                      className="rounded-lg"
                      onClick={() => setPendingAction({ type: "approve", request })}
                    >
                      <Check className="size-4" />
                      {isAr ? "اعتماد النقل" : "Approve transfer"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => setPendingAction({ type: "reject", request })}
                    >
                      <X className="size-4" />
                      {isAr ? "رفض" : "Reject"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}

      <Dialog open={Boolean(pendingAction)} onOpenChange={(open) => !open && setPendingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.type === "approve"
                ? isAr
                  ? "اعتماد طلب النقل؟"
                  : "Approve transfer request?"
                : isAr
                  ? "رفض طلب النقل؟"
                  : "Reject transfer request?"}
            </DialogTitle>
            <DialogDescription>
              {isAr
                ? "سيتم إرسال القرار إلى الخادم ولا يمكن الاعتماد على الواجهة فقط."
                : "This decision will be sent to the backend and cannot rely on frontend state only."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingAction(null)}
              disabled={isPending}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="button" onClick={completeAction} disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {pendingAction?.type === "approve"
                ? isAr
                  ? "اعتماد"
                  : "Approve"
                : isAr
                  ? "رفض"
                  : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function TransferField({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="flex gap-2 rounded-lg border bg-muted/30 p-3">
      {icon ? <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">{icon}</span> : null}
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate font-semibold text-foreground">{value || "-"}</p>
      </div>
    </div>
  )
}
