"use client"

import { deleteTransaction } from "@/lib/actions/transactions"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { useToast } from "@/components/ui/toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Category, Transaction } from "@/lib/supabase/types"
import { Pencil, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<Transaction | null>(null)

  function handleDelete(id: string) {
    if (!confirm("Excluir esta transação?")) return
    startTransition(async () => {
      const result = await deleteTransaction(id)
      if (result?.error) toast(result.error, "error")
      else toast("Transação excluída")
    })
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-medium">Nenhuma transação encontrada</p>
        <p className="text-sm mt-1">Use o botão + para adicionar</p>
      </div>
    )
  }

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, t) => {
    if (!acc[t.date]) acc[t.date] = []
    acc[t.date].push(t)
    return acc
  }, {})

  return (
    <>
      <div className="space-y-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-2">
              {formatDate(date)}
            </p>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {items.map((t, i) => (
                <div
                  key={t.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    i < items.length - 1 && "border-b border-border"
                  )}
                >
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
                    <p className="text-xs text-muted-foreground">{t.categories?.name}</p>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold shrink-0",
                      t.type === "income" ? "text-income" : "text-expense"
                    )}
                  >
                    {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount))}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditing(t)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TransactionDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        categories={categories}
        transaction={editing ?? undefined}
      />
    </>
  )
}
