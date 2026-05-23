import { z } from "zod"

import { emailSchema, nameSchema, passwordSchema, phoneSchema } from "./common.schema"
import { idSchema } from "./common.schema"

export const createOrgChildSchema = z.object({
  organizationId: z.string().min(1),
  name: nameSchema,
  birthDate: z.string().min(1, "Birth date is required"),
  gender: z.string().min(1, "Gender is required"),
  classId: z.string().min(1, "Class is required"),
  parentName: nameSchema,
  parentEmail: emailSchema,
  parentPhone: phoneSchema,
  parentPassword: passwordSchema,
})

export const createPrivateChildSchema = z.object({
  name: nameSchema,
  birthDate: z.string().min(1, "Birth date is required"),
  gender: z.string().min(1, "Gender is required"),
  currentCount: z.coerce.number().int().min(0).optional(),
})

export const updateChildSchema = z.object({
  id: idSchema.shape.id,
  name: z.string().min(1).optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  classId: z.string().optional(),
})

export type CreateOrgChildFormValues = z.infer<typeof createOrgChildSchema>
export type CreatePrivateChildFormValues = z.infer<typeof createPrivateChildSchema>
export type UpdateChildFormValues = z.infer<typeof updateChildSchema>
