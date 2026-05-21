import { z } from "zod"

type TranslateFn = (key: string) => string

export const createBeneficiaryOrganizationSchema = (t: TranslateFn) =>
  z.object({
    accountType: z.enum(["teacher", "parent", "organization"]),
    name: z
      .string()
      .min(2, t("name.min"))
      .max(50, t("name.max")),
    email: z.string().email(t("email.invalid")),
    password: z
      .string()
      .min(8, t("password.min"))
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
        t("password.pattern")
      ),
    phone: z.string().min(6, t("phone.min")),
    organizationName: z.string().min(2, t("organization_name.min")),
    organizationType: z
      .union([
        z.enum(["center", "nursery", "training", "school"]),
        z.literal(""),
      ])
      .refine((val) => val !== "", {
        message: t("organization_type.required"),
      }),
  })

export type BeneficiaryOrganizationFormValues = z.input<
  ReturnType<typeof createBeneficiaryOrganizationSchema>
>

export type BeneficiaryOrganizationSchema = z.output<
  ReturnType<typeof createBeneficiaryOrganizationSchema>
>