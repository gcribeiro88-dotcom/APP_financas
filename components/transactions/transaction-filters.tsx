"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getMonthLabel } from "@/lib/utils"
import type { Category } from "@/lib/supabase/types"

interface TransactionFiltersProps {
  year: number
  month: number
  categories: Category[]
  selectedCategory: string
  selectedType: string
}

export function TransactionFilters({
  year,
  month,
  categories,
  selectedCategory,
  selectedType,
}: TransactionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  function navigate(newYear: number, newMonth: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("year", String(newYear))
    params.set("month", String(newMonth))
    router.push(`?${params.toString()}`)
  }

  function prev() {
    if (month === 1) navigate(year - 1, 12)
    else navigate(year, month - 1)
  }

  function next() {
    if (month === 12) navigate(year + 1, 1)
    else navigate(year, month + 1)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-muted rounded-xl px-3 py-2">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-border transition-colors text-muted-foreground">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm capitalize text-foreground">
          {getMonthLabel(year, month)}
        </span>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-border transition-colors text-muted-foreground">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={selectedType}
          onChange={(e) => update("type", e.target.value)}
          className="flex-1 h-9 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos os tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => update("category", e.target.value)}
          className="flex-1 h-9 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
