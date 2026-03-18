import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { getEmployeeById } from "@/features/employees"
import { getTranslations } from "next-intl/server"
import EmployeesInfo from "@/features/employees/components/EmployeesInfo"

type PageProps = {
  params: {
    locale: string
    employeeId: string
  }
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const t = await getTranslations()
  const res = await getEmployeeById((await params).employeeId)
  if (!res.ok) {
    throw new Error(t("Dashboard.Employees.errors.loadFailed"))
  }

  const employee = await res.json()

  const initials = employee.user.name
    ?.split(" ")
    .map((part: string) => part[0])
    .join("")
    .toUpperCase()

  return (
    <>
      <SiteHeader titleKey="Dashboard.Employees.titles.details" />
      <div className="flex flex-1 flex-col px-4 py-6 lg:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <EmployeesInfo initials={initials} employee={employee}/>
        </div>
      </div>
    </>
  )
}

