"use client"

import { Controller, useFormContext } from "react-hook-form"
import PhoneInput from "react-phone-number-input"

import Checkbox from "@/components/shared/forms/CheckboxField"
import PasswordField from "@/components/shared/forms/PasswordField"
import Select from "@/components/shared/forms/Select"
import TextArea from "@/components/shared/forms/TextArea"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputTypes } from "@/lib/types/enums"
import type { IFormField } from "@/lib/types/interfaces"
import { cn } from "@/lib/utils"

import "react-phone-number-input/style.css"

type Props = {
  fields: IFormField[]
}

export function RhfFormFields({ fields }: Props) {
  const form = useFormContext()

  return (
    <>
      {fields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name as never}
          render={({ field: rhfField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>{renderControl(field, rhfField)}</FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  )
}

function renderControl(
  field: IFormField,
  rhfField: {
    name: string
    value: string
    onChange: (value: unknown) => void
    onBlur: () => void
    ref: React.Ref<HTMLInputElement>
  },
) {
  const type = field.type as InputTypes

  if (type === InputTypes.TEL) {
    return (
      <PhoneInput
        international
        defaultCountry="SA"
        placeholder={field.placeholder}
        disabled={field.disabled}
        value={String(rhfField.value ?? "")}
        onChange={(value) => rhfField.onChange(value ?? "")}
        onBlur={rhfField.onBlur}
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs",
        )}
      />
    )
  }

  if (type === InputTypes.PASSWORD) {
    const { name: _fieldName, ...passwordProps } = field
    return (
      <PasswordField
        {...passwordProps}
        error={{}}
        name={rhfField.name}
        defaultValue={String(rhfField.value ?? "")}
      />
    )
  }

  if (type === InputTypes.CHECKBOX) {
    return (
      <Checkbox
        name={rhfField.name}
        label={field.label}
        checked={field.checked}
      />
    )
  }

  if (type === InputTypes.TEXTAREA) {
    const { name: _fieldName, ...textareaProps } = field
    return (
      <TextArea
        {...textareaProps}
        name={rhfField.name}
        error={{}}
        defaultValue={String(rhfField.value ?? "")}
      />
    )
  }

  if (type === InputTypes.SELECT && field.data) {
    return <Select {...field} data={field.data} error={{}} />
  }

  return (
    <Input
      type={type === InputTypes.EMAIL ? "email" : type === InputTypes.NUMBER ? "number" : "text"}
      placeholder={field.placeholder}
      disabled={field.disabled}
      autoFocus={field.autoFocus}
      name={rhfField.name}
      value={String(rhfField.value ?? "")}
      onChange={rhfField.onChange}
      onBlur={rhfField.onBlur}
      ref={rhfField.ref}
    />
  )
}
