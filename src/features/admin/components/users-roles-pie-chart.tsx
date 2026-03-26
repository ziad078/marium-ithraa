"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "users with roles"



const chartConfig = {
    users: {
        label: "users",
    },
    organizationOwners: {
        label: "organization owners",
        color: "var(--chart-1)",
    },
    employees: {
        label: "employees",
        color: "var(--chart-2)",
    },
    enrichers: {
        label: "enrichers",
        color: "var(--chart-3)",
    },

} satisfies ChartConfig



const UsersRolesPieChart = ({enrihcersNO, employeesNo, organizationOnwersNo}: {
    enrihcersNO: number
    employeesNo: number
    organizationOnwersNo: number
}) => {
    const chartData = [
        { role: "organizationOwners", users: organizationOnwersNo, fill: "var(--chart-1)" },
        { role: "employees", users: employeesNo, fill: "var(--chart-2)" },
        { role: "enrichers", users: enrihcersNO, fill: "var(--chart-3)" },
      ]
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Users-Roles</CardTitle>
                <CardDescription>shows uses divdied into roles</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="users" label nameKey="role" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}

export default UsersRolesPieChart