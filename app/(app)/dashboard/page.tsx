import { createClient } from "@/lib/supabase/server"
import { getDashboardData, getMonthlyTrend } from "@/lib/actions/transactions"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { CategoryBarChart } from "@/components/dashboard/category-bar-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart"
import { MonthSelector } from "@/components/dashboard/month-selector"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentMonth } from "@/lib/utils"
import { Suspense } from "react"

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>
}

async function DashboardContent({ year, month }: { year: number; month: number }) {
  const [{ transactions, totalIncome, totalExpense, balance, byCategory }, monthlyTrend] =
    await Promise.all([
      getDashboardData(year, month),
      getMonthlyTrend(year, month),
    ])

  return (
    <>
      {/* Row 1: Balance + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 min-h-48">
          <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
        </div>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest">
              Últimas Transações
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <RecentTransactions transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Trend + Category donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest">
              Tendência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <MonthlyTrendChart data={monthlyTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest">
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <CategoryBarChart data={byCategory} />
          </CardContent>
        </Card>
      </div>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Olá, {name} 👋</p>
            <p className="text-white text-2xl font-bold mt-0.5 uppercase tracking-wide">Visão Geral</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <MonthSelector year={year} month={month} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 py-6 pb-24">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3 h-48 animate-pulse bg-muted rounded-2xl" />
              <div className="lg:col-span-2 h-48 animate-pulse bg-muted rounded-2xl" />
              <div className="lg:col-span-2 h-64 animate-pulse bg-muted rounded-2xl mt-4" />
              <div className="lg:col-span-2 h-64 animate-pulse bg-muted rounded-2xl mt-4" />
            </div>
          }
        >
          <DashboardContent year={year} month={month} />
        </Suspense>
      </div>
    </div>
  )
}
