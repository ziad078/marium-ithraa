"use client"
import { Field, FieldContent } from '@/components/ui/field'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

const TestInfo = () => {
  const form = useFormContext()

  return (
    <div>
        <Field>
          <FieldContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>test title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder={"enter test title"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>test description</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder={"enter test description"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldContent>
        </Field>
    </div>
  )
}

export default TestInfo