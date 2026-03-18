"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import { IconPlus } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

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
import { createChildAction } from "../actions/create-child.action"
import { useSession } from "next-auth/react"

export function AddChildDialog() {
  const t = useTranslations()
  const [isOpenState, setIsOpenState] = useState(false)
  const [gender, setGender] = useState<string>("")
  const [state, formAction, isPending] = useActionState<InitialState, FormData>(
    createChildAction,
    { message: "", error: {}, status: null, formData: null },
  )
  const {data: session} = useSession()
  useEffect(() => {
    if (!state?.status) return

    if (state.status === StatusCode.CREATED) {
      toast.success(state.message ?? t("Dashboard.Children.toast.created"))
      setIsOpenState(false)
      setGender("")
      return
    }

    if (state.status && state.message) {
      toast.error(state.message)
    }
  }, [state.message, state.status])

  return (
    <Dialog open={isOpenState} onOpenChange={setIsOpenState}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">{t("Dashboard.Children.actions.add")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
        <form className="flex flex-col gap-4" action={formAction}>
          <DialogHeader>
            <DialogTitle>{t("Dashboard.Children.dialog.addTitle")}</DialogTitle>
            <DialogDescription>{t("Dashboard.Children.dialog.addDescription")}</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <input type="hidden" name="gender" value={gender} />
            <input type="hidden" name="user_id" value={session?.user.id} />
            <div className="grid gap-2">
              <Label htmlFor="child-name">{t("Dashboard.Children.fields.name")}</Label>
              <Input
                id="child-name"
                name="name"
                defaultValue={(state.formData?.get("name") as string) ?? ""}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="child-grade">{t("Dashboard.Children.fields.grade")}</Label>
              <Input
                id="child-grade"
                name="grade"
                defaultValue={(state.formData?.get("grade") as string) ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="child-birthDate">{t("Dashboard.Children.fields.birthDate")}</Label>
              <Input
                id="child-birthDate"
                type="date"
                name="birthDate"
                defaultValue={(state.formData?.get("birthDate") as string) ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("Dashboard.Children.fields.gender")}</Label>
              <Select
                value={gender}
                onValueChange={setGender}
              >
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

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {t("Dashboard.common.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("Dashboard.common.adding")}
                </>
              ) : (
                t("Dashboard.common.add")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

