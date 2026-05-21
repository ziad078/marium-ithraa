"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { IconPlus } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { StatusCode } from "@/lib/types/enums"
import { type InitialState } from "@/lib/types/types"
import { createTestAction } from "../actions/create-test-action"
import TestInfo from "./TestInfo"
import QuestionsAdding from "./QuestionsAdding"
import { Question } from "../types/interfaces"




export function AddTestDialog() {
    const [steps, setSteps] = useState(1)
    const t = useTranslations()
    const [isOpenState, setIsOpenState] = useState(false)
    const [state, formAction, isPending] = useActionState<InitialState, FormData>(
        createTestAction,
        { message: "", error: {}, status: null, formData: null },
    )
    const [questions, setQuestions] = useState<Partial<Question>[]>([])

    useEffect(() => {
        if (!state?.status) return

        if (state.status === StatusCode.CREATED) {
            toast.success(state.message ?? t("Features.Tests.toast.created"))
            setIsOpenState(false)
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
                    <span className="hidden lg:inline">{t("Features.Tests.Actions.Add")}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm max-h-150 overflow-y-auto">
                <form action={formAction}>

                    <input
                        type="hidden"
                        name="questions"
                        value={JSON.stringify(questions)}
                    />

                    {steps === 1 && (
                        <TestInfo state={state} setSteps={setSteps} />
                    )}

                    {steps === 2 && (
                        <QuestionsAdding
                            setSteps={setSteps}
                            isPending={isPending}
                            questions={questions}
                            setQuestions={setQuestions}
                        />
                    )}

                </form>
            </DialogContent>
        </Dialog>
    )
}

