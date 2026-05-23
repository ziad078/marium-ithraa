"use client"

import { IconPlus } from "@tabler/icons-react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ServerActionForm } from "@/features/forms"
import { FormTypes, StatusCode } from "@/lib/types/enums"
import type { InitialState } from "@/lib/types/types"

import { createEmployeeAction } from "../actions/create-employee.action"

export function AddEmployeeDialog({ organizationId }: { organizationId: string }) {
  const t = useTranslations("Forms.Employee")
  const tCommon = useTranslations("Dashboard.common")
  const [isOpen, setIsOpen] = useState(false)

  const handleStatus = (state: InitialState) => {
    if (state.status === StatusCode.CREATED) {
      toast.success(state.message ?? t("toast.created"))
      setIsOpen(false)
      return
    }
    if (state.status && state.message) {
      toast.error(state.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">{t("dialogTitle")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <ServerActionForm
          formType={FormTypes.EMPLOYEE}
          action={createEmployeeAction}
          hiddenFields={{ organization_id: organizationId }}
          onStatusChange={handleStatus}
        >
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {tCommon("cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin hidden [[disabled]_&]:inline" />
              {tCommon("add")}
            </Button>
          </DialogFooter>
        </ServerActionForm>
      </DialogContent>
    </Dialog>
  )
}
