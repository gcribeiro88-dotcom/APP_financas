"use server"

import { createClient } from "@/lib/supabase/server"
import { transactionSchema } from "@/lib/validations/transaction"
import { revalidatePath } from "next/cache"
import type { Transaction } from "@/lib/supabase/types"

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const raw = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    category_id: formData.get("category_id"),
    date: formData.get("date"),
  }

  const parsed = transactionSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from("transactions").insert({
    type: parsed.data.type,
    amount: parsed.data.amount,
    category_id: parsed.data.category_id,
    date: parsed.data.date,
    description: parsed.data.description || null,
    user_id: user.id,
  } as never)

  if (error) return { error: (error as Error).message }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const raw = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    category_id: formData.get("category_id"),
    date: formData.get("date"),
  }

  const parsed = transactionSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from("transactions")
    .update({
      type: parsed.data.type,
      amount: parsed.data.amount,
      category_id: parsed.data.category_id,
      date: parsed.data.date,
      description: parsed.data.description || null,
    } as never)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: (error as Error).message }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: (error as Error).message }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function getTransactions(
  year: number,
  month: number,
  categoryId?: string,
  type?: string
): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const start = `${year}-${String(month).padStart(2, "0")}-01`
  const end = new Date(year, month, 0).toISOString().split("T")[0]

  let query = supabase
    .from("transactions")
    .select("*, categories(*)")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false })

  if (categoryId) query = query.eq("category_id", categoryId)
  if (type === "income" || type === "expense") query = query.eq("type", type)

  const { data } = await query
  return (data ?? []) as unknown as Transaction[]
}

export async function getDashboardData(year: number, month: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { transactions: [], totalIncome: 0, totalExpense: 0, balance: 0, byCategory: [] }

  const start = `${year}-${String(month).padStart(2, "0")}-01`
  const end = new Date(year, month, 0).toISOString().split("T")[0]

  const { data } = await supabase
    .from("transactions")
    .select("*, categories(*)")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false })

  const all = ((data ?? []) as unknown as Transaction[])
  const totalIncome = all.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = all.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0)

  const expenseMap: Record<string, { name: string; color: string; total: number }> = {}
  for (const t of all.filter((t) => t.type === "expense")) {
    const cat = t.categories
    const key = t.category_id ?? "outros"
    if (!expenseMap[key]) {
      expenseMap[key] = { name: cat?.name ?? "Outros", color: cat?.color ?? "#94a3b8", total: 0 }
    }
    expenseMap[key].total += Number(t.amount)
  }

  const byCategory = Object.values(expenseMap).sort((a, b) => b.total - a.total)

  return {
    transactions: all.slice(0, 5),
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    byCategory,
  }
}
