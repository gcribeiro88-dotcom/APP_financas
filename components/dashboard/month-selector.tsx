"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getMonthLabel } from "@/lib/utils"

interface MonthSelectorProps {
  year: number
  month: number
}

export function MonthSelector({ year, month }: MonthSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
    <div className="flex items-center gap-2">
      <button onClick={prev} className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors text-blue-200">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-white font-semibold text-sm min-w-32 text-center capitalize">
        {getMonthLabel(year, month)}
      </span>
      <button onClick={next} className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors text-blue-200">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
