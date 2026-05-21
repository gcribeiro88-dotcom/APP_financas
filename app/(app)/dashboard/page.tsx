import { createClient } from "@/lib/supabase/server"
import { getDashboardData } from "@/lib/actions/transactions"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { CategoryBarChart } from "@/components/dashboard/category-bar-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { MonthSelector } from "@/components/dashboard/month-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentMonth } from "@/lib/utils"
import { Suspense } from "react"

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>
}

async function DashboardContent({ year, month }: { year: number; month: number }) {
  const { transactions, totalIncome, totalExpense, balance, byCategory } =
    await getDashboardData(year, month)

  return (
    <>
      <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
            Despesas por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryBarChart data={byCategory} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
            Últimas Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTransactions transactions={transactions} />
        </CardContent>
      </Card>
    </>
  )
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const now = getCurrentMonth()
  const year = Number(params.year) || now.year
  const month = Number(params.month) || now.month

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "você"

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-primary px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-sm">Olá, {name} 👋</p>
          </div>
          <MonthSelector year={year} month={month} />
        </div>
      </div>

      <div className="px-4 -mt-2 pb-6">
        <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-xl mt-4" />}>
          <DashboardContent year={year} month={month} />
        </Suspense>
      </div>
    </div>
  )
}
