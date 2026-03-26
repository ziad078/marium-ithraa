import React from "react"
import { useFormContext, useFieldArray, Controller } from "react-hook-form"
import { Field, FieldContent } from "@/components/ui/field"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const QuestionsAdding = () => {
  const { control, register, setValue } = useFormContext()

  const { fields: questions, append: appendQuestion } = useFieldArray({
    control,
    name: "questions",
  })

  const addAnswer = (qIndex) => {
    const updated = [...questions]
    updated[qIndex].answers.push({
      text: "",
      score: 0
    })
  
    setValue("questions", updated)
  }

  return (
    <div>
      <div className="mt-4">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="mb-6 border p-4 rounded">
            <Controller
              control={control}
              name={`questions.${qIndex}.content`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question {qIndex + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter question text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-2">
              {(q.answers || []).map((a, aIndex) => (
                <div key={aIndex} className="flex gap-2 mb-2">
                  <Controller
                    control={control}
                    name={`questions.${qIndex}.answers.${aIndex}.text`}
                    render={({ field }) => <Input {...field} placeholder="Answer text" />}
                  />
                  <Controller
                    control={control}
                    name={`questions.${qIndex}.answers.${aIndex}.score`}
                    render={({ field }) => <Input type="number" {...field} placeholder="Score" />}
                  />
                </div>
              ))}
              <Button type="button" onClick={() => addAnswer(qIndex)}>
                Add Answer
              </Button>
            </div>
          </div>
        ))}

        <Button type="button" onClick={() => appendQuestion({ content: "", answers: [] })}>
          Add Question
        </Button>
      </div>
    </div>
  )
}

export default QuestionsAdding