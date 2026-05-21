import type { ReactNode } from "react"

import RequireRoles from "@/features/auth/components/RequireRoles"
import { UserRole } from "@/lib/types/enums"

export default async function AdminEvalCreateLayout({ children }: { children: ReactNode }) {
  return (
    <RequireRoles allowed={[UserRole.ADMIN]} redirectTo="/unauthorized">
      {children}
    </RequireRoles>
  )
}

