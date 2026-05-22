"use client"

import { formatCurrency } from "@/lib/utils"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface CategoryData {
  name: string
  color: string
  total: number
}

interface CategoryBarChartProps {
  data: CategoryData[]
}

function CustomTooltip({ active, payload }: {
  active?: boolean
  payload?: Array<{ payload: CategoryData }>
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="font-medium text-foreground">{d.name}</p>
      <p className="text-muted-foreground">{formatCurrency(d.total)}</p>
    </div>
  )
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
        Sem despesas neste período
      </div>
    )
  }

  const total = data.reduce((s, d) => s + d.total, 0)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="total"
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.slice(0, 6).map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-muted-foreground truncate flex-1">{d.name}</span>
            <span className="text-xs font-medium text-foreground shrink-0">
              {((d.total / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
