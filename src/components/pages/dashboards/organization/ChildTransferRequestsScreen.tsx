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
import { rejectChildTransfer, type ChildTransferRequest } from "@/features/children"
import { formatChildBirthDate, getChildClassName } from "@/features/children/utils/display"
import { getTextDirection } from "@/lib/i18n/locale-utils"
import { ApproveChildTransferDialog } from "./ApproveChildTransferDialog"

type Props = {
  locale: string
  requests: ChildTransferRequest[]
}

export function ChildTransferRequestsScreen({ locale, requests }: Props) {
  const [items, setItems] = useState(requests)
  const [approveRequest, setApproveRequest] = useState<ChildTransferRequest | null>(null)
  const [rejectRequest, setRejectRequest] = useState<ChildTransferRequest | null>(null)
  const [isPending, startTransition] = useTransition()
  const isAr = locale === "ar"

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === "pending"),
    [items],
  )

  function removeRequest(requestId: string) {
    setItems((current) => current.filter((item) => item.id !== requestId))
  }

  function completeReject() {
    if (!rejectRequest) return

    startTransition(async () => {
      try {
        const response = await rejectChildTransfer(rejectRequest.id)
        removeRequest(rejectRequest.id)
        toast.success(response.message || (isAr ? "تم رفض طلب النقل" : "Transfer request rejected"))
        setRejectRequest(null)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : isAr
              ? "تعذر تحديث طلب النقل"
              : "Unable to update transfer request",
        )
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
                      label={isAr ? "الفصل الحالي" : "Current class"}
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
                      onClick={() => setApproveRequest(request)}
                    >
                      <Check className="size-4" />
                      {isAr ? "اعتماد النقل" : "Approve transfer"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => setRejectRequest(request)}
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

      <ApproveChildTransferDialog
        open={Boolean(approveRequest)}
        locale={locale}
        request={approveRequest}
        onOpenChange={(open) => {
          if (!open) setApproveRequest(null)
        }}
        onApproved={removeRequest}
      />

      <Dialog open={Boolean(rejectRequest)} onOpenChange={(open) => !open && setRejectRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAr ? "رفض طلب النقل؟" : "Reject transfer request?"}</DialogTitle>
            <DialogDescription>
              {isAr
                ? "سيتم إرسال قرار الرفض إلى الخادم وإزالة الطلب من القائمة."
                : "This rejection will be sent to the backend and the request will be removed from the list."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectRequest(null)}
              disabled={isPending}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="button" onClick={completeReject} disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isAr ? "رفض" : "Reject"}
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
