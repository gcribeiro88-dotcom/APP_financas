"use client"

import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { createTransaction, updateTransaction } from "@/lib/actions/transactions"
import { useToast } from "@/components/ui/toast"
import type { Category, Transaction } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"

interface TransactionDialogProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  transaction?: Transaction
}

export function TransactionDialog({ open, onClose, categories, transaction }: TransactionDialogProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<"income" | "expense">(transaction?.type ?? "expense")

  const filtered = categories.filter((c) => c.type === type || c.type === "both")
  const isEditing = !!transaction
  const today = new Date().toISOString().split("T")[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("type", type)

    startTransition(async () => {
      const result = isEditing
        ? await updateTransaction(transaction.id, formData)
        : await createTransaction(formData)

      if (result?.error) {
        toast(result.error, "error")
      } else {
        toast(isEditing ? "Transação atualizada!" : "Transação criada!")
        onClose()
      }
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar Transação" : "Nova Transação"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors",
              type === "expense"
                ? "bg-destructive text-white"
                : "bg-muted text-muted-foreground hover:bg-red-50"
            )}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors",
              type === "income"
                ? "bg-income text-white"
                : "bg-muted text-muted-foreground hover:bg-green-50"
            )}
          >
            Receita
          </button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            defaultValue={transaction?.amount}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            name="description"
            type="text"
            placeholder="Ex: Supermercado, Salário..."
            defaultValue={transaction?.description ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id">Categoria</Label>
          <Select
            id="category_id"
            name="category_id"
            defaultValue={transaction?.category_id ?? ""}
            required
          >
            <option value="" disabled>Selecionar categoria...</option>
            {filtered.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={transaction?.date ?? today}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
