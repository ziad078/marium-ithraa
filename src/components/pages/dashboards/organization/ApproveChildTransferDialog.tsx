"use client"

import { useEffect, useMemo, useState } from "react"
import { showErrorToast, showSuccessToast } from "@/lib/toast/app-toast"
import { Check, Loader2, School } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { approveChildTransfer, type ChildTransferRequest } from "@/features/children"
import { getOrganizationClasses, type ClassItem } from "@/features/classes"

type Props = {
  open: boolean
  locale: string
  request: ChildTransferRequest | null
  onOpenChange: (open: boolean) => void
  onApproved: (requestId: string) => void
}

export function ApproveChildTransferDialog({
  open,
  locale,
  request,
  onOpenChange,
  onApproved,
}: Props) {
  const isAr = locale === "ar"
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const targetOrganizationId = request?.toOrganizationId ?? request?.toOrganization?.id ?? ""
  const targetOrganizationName = useMemo(() => {
    return (
      request?.toOrganization?.organizationName ||
      request?.toOrganization?.name ||
      (isAr ? "المؤسسة المستهدفة" : "target organization")
    )
  }, [isAr, request?.toOrganization?.name, request?.toOrganization?.organizationName])

  useEffect(() => {
    if (!open || !request) return

    let isActive = true
    setSelectedClassId("")
    setClasses([])

    if (!targetOrganizationId) {
      showErrorToast({ raw: isAr ? "تعذر تحديد المؤسسة المستهدفة." : "Unable to identify the target organization." })
      return
    }

    setIsLoadingClasses(true)
    getOrganizationClasses(targetOrganizationId)
      .then((response) => {
        if (!isActive) return
        setClasses(response.classes ?? [])
      })
      .catch((error) => {
        if (!isActive) return
        showErrorToast(
          { raw: error instanceof Error
            ? error.message
            : isAr
              ? "تعذر تحميل الفصول."
              : "Unable to load classes." }
        )
      })
      .finally(() => {
        if (isActive) setIsLoadingClasses(false)
      })

    return () => {
      isActive = false
    }
  }, [isAr, open, request, targetOrganizationId])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return
    onOpenChange(nextOpen)
  }

  async function handleApprove() {
    if (!request || !selectedClassId) return

    setIsSubmitting(true)
    try {
      const response = await approveChildTransfer(request.id, selectedClassId)
      onApproved(request.id)
      onOpenChange(false)
      showSuccessToast({ raw: response.message || (isAr ? "تم اعتماد طلب النقل." : "Transfer request approved.") })
    } catch (error) {
      showErrorToast(
        { raw: error instanceof Error
          ? error.message
          : isAr
            ? "تعذر اعتماد طلب النقل."
            : "Unable to approve transfer request." }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasClasses = classes.length > 0
  const childName = request?.child?.name || (isAr ? "الطفل" : "the child")
  const canSubmit = Boolean(selectedClassId) && !isLoadingClasses && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isAr ? "اعتماد نقل الطفل" : "Approve child transfer"}</DialogTitle>
          <DialogDescription>
            {isAr
              ? `اختر الفصل الذي سينضم إليه ${childName} في ${targetOrganizationName}.`
              : `Choose the class ${childName} will join in ${targetOrganizationName}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <School className="size-4 text-muted-foreground" />
            <span>{isAr ? "الفصل" : "Class"}</span>
          </div>

          {isLoadingClasses ? (
            <div className="flex h-11 items-center gap-2 rounded-lg border px-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {isAr ? "جاري تحميل الفصول..." : "Loading classes..."}
            </div>
          ) : (
            <Select
              value={selectedClassId}
              onValueChange={setSelectedClassId}
              disabled={!targetOrganizationId || !hasClasses || isSubmitting}
            >
              <SelectTrigger className="h-11 w-full rounded-lg">
                <SelectValue placeholder={isAr ? "اختر الفصل" : "Select a class"} />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {formatClassLabel(classItem)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!isLoadingClasses && targetOrganizationId && !hasClasses ? (
            <p className="text-sm text-muted-foreground">
              {isAr ? "لا توجد فصول متاحة لهذه المؤسسة." : "No classes are available for this organization."}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            {isAr ? "إلغاء" : "Cancel"}
          </Button>
          <Button type="button" onClick={handleApprove} disabled={!canSubmit}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            {isAr ? "اعتماد النقل" : "Approve transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function formatClassLabel(classItem: ClassItem) {
  return classItem.gradeName ? `${classItem.name} - ${classItem.gradeName}` : classItem.name
}
