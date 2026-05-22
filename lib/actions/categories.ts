"use server"

import { createClient } from "@/lib/supabase/server"
import { categorySchema } from "@/lib/validations/category"
import { revalidatePath } from "next/cache"
import type { Category } from "@/lib/supabase/types"

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order("is_default", { ascending: false })
    .order("name")

  return (data ?? []) as unknown as Category[]
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    color: formData.get("color"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    type: parsed.data.type,
    color: parsed.data.color,
    user_id: user.id,
    is_default: false,
  } as never)

  if (error) {
    console.error("[createCategory] Supabase error:", error)
    return { error: error.message }
  }

  revalidatePath("/categories")
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    color: formData.get("color"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      type: parsed.data.type,
      color: parsed.data.color,
    } as never)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: (error as Error).message }

  revalidatePath("/categories")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: (error as Error).message }

  revalidatePath("/categories")
  return { success: true }
}
