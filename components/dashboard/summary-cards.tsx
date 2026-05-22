import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
  balance: number
}

export function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  return (
    <div className="h-full flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-primary to-blue-800 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Saldo do Mês</p>
          <p className="text-4xl font-bold tracking-tight">{formatCurrency(balance)}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-300" />
            <span className="text-blue-200 text-xs uppercase tracking-wide">Receitas</span>
          </div>
          <p className="text-xl font-bold text-green-300">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-orange-300" />
            <span className="text-blue-200 text-xs uppercase tracking-wide">Despesas</span>
          </div>
          <p className="text-xl font-bold text-orange-300">{formatCurrency(totalExpense)}</p>
        </div>
      </div>
    </div>
  )
}
