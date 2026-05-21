"use client"

import { cn } from "@/lib/utils"
import { Home, List, Plus, Tag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import type { Category } from "@/lib/supabase/types"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/transactions", icon: List, label: "Extratos" },
  { href: "/categories", icon: Tag, label: "Categorias" },
  { href: "/profile", icon: User, label: "Perfil" },
]

interface BottomNavProps {
  categories: Category[]
}

export function BottomNav({ categories }: BottomNavProps) {
  const pathname = usePathname()
  const [dialogOpen, setDialogOpen] = useState(false)

  const half1 = navItems.slice(0, 2)
  const half2 = navItems.slice(2)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border md:hidden">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {half1.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", active && "fill-primary/20")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg -mt-5 hover:bg-blue-700 transition-colors active:scale-95"
            aria-label="Nova transação"
          >
            <Plus className="w-6 h-6" />
          </button>

          {half2.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", active && "fill-primary/20")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        categories={categories}
      />
    </>
  )
}
