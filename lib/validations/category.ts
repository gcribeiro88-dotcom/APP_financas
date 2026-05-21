import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
})

export type CategoryFormData = z.infer<typeof categorySchema>
