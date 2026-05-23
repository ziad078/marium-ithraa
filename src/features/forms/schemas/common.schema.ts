import { z } from "zod"

export const idSchema = z.object({
  id: z.string().min(1, "Invalid id"),
})

export const phoneSchema = z.string().min(6, "Phone is required")
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters")
export const emailSchema = z.string().email("Invalid email")
export const nameSchema = z.string().min(2, "Name is required")
