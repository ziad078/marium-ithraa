"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Gender, StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"

import { type Child } from "../types/interfaces"
import { updateChildAction } from "../actions/update-child.action"
import { deleteChildAction, type DeleteChildState } from "../actions/delete-child.action"

type Props = {
  child: Child
}

export function ChildRowActions({ child }: Props) {
  const t = useTranslations()
  const [updateDialogOpenState, setUpdateDialogOpenState] = useState(false)
  const [deleteDialogOpenState, setDeleteDialogOpenState] = useState(false)

  const defaultBirthDate = useMemo(() => {
    const d = child.birthDate ? new Date(child.birthDate) : null
    if (!d || Number.isNaN(d.getTime())) return ""
    return d.toISOString().slice(0, 10)
  }, [child.birthDate])

  const [gender, setGender] = useState<string>(child.gender ?? "")

  const [updateState, updateAction, isUpdating] = useActionState<
    InitialState,
    FormData
  >(updateChildAction, { message: "", error: {}, status: null, formData: null })

  const [deleteState, deleteAction, isDeleting] = useActionState<
    DeleteChildState,
    FormData
  >(deleteChildAction, { ok: false })

  useEffect(() => {
    if (deleteState.ok) {
      toast.success(t("Dashboard.Children.toast.deleted"))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeleteDialogOpenState(false)
      return
    }
    if (deleteState.error) toast.error(deleteState.error)
  }, [deleteState, t])

  useEffect(() => {
    if (updateState.status === StatusCode.OK) {
      toast.success(updateState.message ?? t("Dashboard.Children.toast.updated"))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUpdateDialogOpenState(false)
      return
    }
    if (updateState.status && updateState.message) toast.error(updateState.message)
  }, [updateState.message, updateState.status, t])

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog onOpenChange={setUpdateDialogOpenState} open={updateDialogOpenState}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
          <form action={updateAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={child.id} />
            <input type="hidden" name="gender" value={gender} />
            <DialogHeader>
              <DialogTitle>{t("Dashboard.Children.dialog.editTitle")}</DialogTitle>
              <DialogDescription>{t("Dashboard.Children.dialog.editDescription")}</DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <div className="grid gap-2">
                <Label htmlFor={`child-name-${child.id}`}>{t("Dashboard.Children.fields.name")}</Label>
                <Input
                  id={`child-name-${child.id}`}
                  name="name"
                  defaultValue={child.name}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`child-grade-${child.id}`}>{t("Dashboard.Children.fields.grade")}</Label>
                <Input id={`child-grade-${child.id}`} name="grade" defaultValue={child.grade} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`child-birthDate-${child.id}`}>{t("Dashboard.Children.fields.birthDate")}</Label>
                <Input
                  id={`child-birthDate-${child.id}`}
                  type="date"
                  name="birthDate"
                  defaultValue={defaultBirthDate}
                />
              </div>

              <div className="grid gap-2">
                <Label>{t("Dashboard.Children.fields.gender")}</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Dashboard.Children.fields.genderPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>{t("Dashboard.Children.gender.male")}</SelectItem>
                    <SelectItem value={Gender.FEMALE}>{t("Dashboard.Children.gender.female")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="h-11 rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("Dashboard.common.saving")}
                  </>
                ) : (
                  t("Dashboard.common.saveChanges")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpenState} onOpenChange={setDeleteDialogOpenState}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form action={deleteAction}>
            <input type="hidden" name="id" value={child.id} />
            <DialogHeader>
              <DialogTitle>{t("Dashboard.Children.dialog.deleteTitle")}</DialogTitle>
              <DialogDescription>
                {t("Dashboard.Children.dialog.deleteDescription")}
              </DialogDescription>
            </DialogHeader>
            {deleteState?.error && (
              <p className="mt-2 text-sm text-destructive">{deleteState.error}</p>
            )}
            <DialogFooter className="mt-4">
              <Button type="submit" variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("Dashboard.common.deleting")}
                  </>
                ) : (
                  t("Dashboard.common.delete")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

