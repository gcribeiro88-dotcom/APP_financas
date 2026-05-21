import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions.length) {
    return (
      <p className="text-center text-muted-foreground text-sm py-6">
        Nenhuma transação neste mês
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center gap-3 py-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
            style={{ backgroundColor: t.categories?.color ?? "#94a3b8" }}
          >
            {(t.categories?.name ?? "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {t.description || t.categories?.name || "Sem descrição"}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.categories?.name} · {formatDate(t.date)}
            </p>
          </div>
          <span
            className={cn(
              "text-sm font-semibold shrink-0",
              t.type === "income" ? "text-income" : "text-expense"
            )}
          >
            {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount))}
          </span>
        </li>
      ))}
    </ul>
  )
}
