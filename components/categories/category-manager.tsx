"use client"

import { deleteCategory } from "@/lib/actions/categories"
import { CategoryForm } from "@/components/categories/category-form"
import { Dialog } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import type { Category } from "@/lib/supabase/types"
import { Lock, Pencil, Plus, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"

interface CategoryManagerProps {
  categories: Category[]
}

const TYPE_LABELS = { income: "Receita", expense: "Despesa", both: "Ambos" }

export function CategoryManager({ categories }: CategoryManagerProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria?")) return
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result?.error) toast(result.error, "error")
      else toast("Categoria excluída")
    })
  }

  const defaults = categories.filter((c) => c.is_default)
  const custom = categories.filter((c) => !c.is_default)

  return (
    <>
      <div className="space-y-5">
        {custom.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
              Minhas categorias
            </p>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {custom.map((cat, i) => (
                <div
                  key={cat.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i < custom.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div
                    className="w-9 h-9 rounded-xl shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{TYPE_LABELS[cat.type]}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditing(cat)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
            Categorias padrão
          </p>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {defaults.map((cat, i) => (
              <div
                key={cat.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < defaults.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{TYPE_LABELS[cat.type]}</p>
                </div>
                <Lock className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nova categoria
        </button>
      </div>

      <Dialog open={showForm} onClose={() => setShowForm(false)} title="Nova Categoria">
        <CategoryForm onDone={() => setShowForm(false)} />
      </Dialog>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title="Editar Categoria">
        <CategoryForm category={editing ?? undefined} onDone={() => setEditing(null)} />
      </Dialog>
    </>
  )
}
