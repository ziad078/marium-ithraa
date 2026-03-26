"use client"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SiteHeader } from "@/components/site-header"
import DashboardCards from "@/components/shared/cards/DashboardCards"
import { CardInfo } from "@/lib/types/types"
import { Book, Building, Sparkle, User, User2 } from "lucide-react"
import UsersRolesPieChart from "@/features/admin/components/users-roles-pie-chart"
import { useAdminChildren } from "@/features/children"
import { useAdminUsersInRoles } from "@/features/users"
import { DataTable } from "@/components/shared/data-table/DataTable"
import { columns } from "@/features/enrichers"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminTests } from "@/features/tests"

export default function AdminDashboardPage() {

  const { data: children, error, isLoading: isLoadingChildren } = useAdminChildren()
  const { data: usersInRoles, isLoading: isLoadingUsersInRoles } = useAdminUsersInRoles()
  const { data: tests, isLoading: isLoadingTests } = useAdminTests()
  const enrichers = usersInRoles?.enrichers || []
  const employees = usersInRoles?.employees || []
  const organizationOwners = usersInRoles?.organizationOwners || []
  console.log(usersInRoles, "asdfasf", children, tests)

  const cards: CardInfo[] = [
    {
      title: organizationOwners.length||0,
      description: "organization count",
      icon: <Building />,
      isLoading: isLoadingUsersInRoles,
      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: employees.length||0,
      isLoading: isLoadingUsersInRoles,
      description: "organization employees",
      icon: <User />,

      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: children?.children?.length || 0,
      description: "children count",
      icon: <User2 />,
      isLoading: isLoadingChildren,
      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: tests?.tests?.length||0,
      isLoading: isLoadingTests,
      description: "test count",
      icon: <Book />,

      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },
    {
      title: enrichers.length||0,
      description: "enrichers count",
      isLoading: isLoadingUsersInRoles,
      icon: <Sparkle />,

      badage: {
        exist: false,
      },
      footer: {
        exist: false
      }
    },

  ]
  return (
    <>
      <SiteHeader titleKey="Dashboard.titles.dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashboardCards cards={cards} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            {/* <DataTable data={enrichers} columns={columns} /> */}
            <div className="px-4 lg:px-6">
              {isLoadingUsersInRoles ? (
                <Skeleton className="h-15 w-15 rounded-full" />

              ) : (
                <UsersRolesPieChart employeesNo={usersInRoles?.employees?.length||0}
                enrihcersNO={usersInRoles?.enrichers?.length||0}
                organizationOnwersNo={usersInRoles?.organizationOwners?.length||0}
                />

              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

