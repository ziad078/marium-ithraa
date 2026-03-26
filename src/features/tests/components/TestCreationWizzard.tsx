"use client"
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import QuestionsAdding from '@/features/tests/components/QuestionsAdding'
import TestInfo from '@/features/tests/components/TestInfo'
import { StatusCode } from '@/lib/types/enums'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createTestAction } from '../actions/create-test-action'

const TestCreationWizzard = () => {
  const t = useTranslations("Signup.Beneficiary.Wizard")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      questions: []
    }
  })

  async function onSubmit(data) {
    console.log(data)
    setIsSubmitting(true)
    try {
      const result = await createTestAction(form.getValues())
        console.log(result)
      if (result.status === StatusCode.CREATED) {
        // handle success — e.g. toast, redirect
        console.log(result.message)
      } else {
        // handle error — e.g. set form error
        console.error(result.message ?? result.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function next() {
    setStep((s) => s + 1)
  }

  function back() {
    setStep((s) => s - 1)
  }

  return (
    <main>
      <Form {...form}>
        <form
          className='app-container'
          onSubmit={
            step === 1
              ? (event) => { event.preventDefault(); next() }
              : form.handleSubmit(onSubmit)
          }
        >
          {step === 1 && <TestInfo />}
          {step === 2 && <QuestionsAdding />}

          <div className="flex items-center justify-between gap-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={back}>
                {t("back")}
              </Button>
            )}
            <div className="ml-auto">
              <Button type="submit" disabled={isSubmitting}>
                {step === 1 ? t("next") : t("submit")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  )
}

export default TestCreationWizzard