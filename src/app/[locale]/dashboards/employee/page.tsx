import { EmployeeDashboardScreen } from "@/components/pages/dashboards/employee/EmployeeDashboardScreen"
import { DashboardTopBar } from "@/components/shared/dashboard/DashboardTopBar"

export default function EmployeeDashboardPage() {
  return (
    <>
      <DashboardTopBar />
      <EmployeeDashboardScreen />
    </>
  )
}
