import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
  balance: number
}

export function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Card className="bg-primary text-white border-0 shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-200 text-xs font-medium uppercase tracking-wide">Saldo do Mês</span>
            <Wallet className="w-4 h-4 text-blue-300" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          <div className="flex gap-4 mt-3 pt-3 border-t border-blue-500/30">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-300" />
              <span className="text-green-300 text-sm font-medium">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-red-300" />
              <span className="text-red-300 text-sm font-medium">{formatCurrency(totalExpense)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-income" />
              </div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Receitas</span>
            </div>
            <p className="text-xl font-bold text-income">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-expense" />
              </div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Despesas</span>
            </div>
            <p className="text-xl font-bold text-expense">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
