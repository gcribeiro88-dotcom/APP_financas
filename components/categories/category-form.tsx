"use client"

import { createCategory, updateCategory } from "@/lib/actions/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import type { Category } from "@/lib/supabase/types"
import { useTransition } from "react"

const PRESET_COLORS = [
  "#1e40af", "#3b82f6", "#06b6d4", "#10b981", "#16a34a",
  "#eab308", "#f97316", "#ef4444", "#8b5cf6", "#ec4899",
  "#64748b", "#94a3b8",
]

interface CategoryFormProps {
  category?: Category
  onDone: () => void
}

export function CategoryForm({ category, onDone }: CategoryFormProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = category
        ? await updateCategory(category.id, formData)
        : await createCategory(formData)

      if (result?.error) toast(result.error, "error")
      else {
        toast(category ? "Categoria atualizada!" : "Categoria criada!")
        onDone()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome da categoria</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Academia, Streaming..."
          defaultValue={category?.name}
          required
          maxLength={50}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="type">Tipo</Label>
        <Select id="type" name="type" defaultValue={category?.type ?? "expense"}>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
          <option value="both">Ambos</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={category?.color === color || (!category && color === "#3b82f6")}
                className="sr-only peer"
              />
              <div
                className="w-8 h-8 rounded-full peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-foreground transition-all hover:scale-110"
                style={{ backgroundColor: color }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Salvando..." : category ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}
