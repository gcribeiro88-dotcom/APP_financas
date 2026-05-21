import { z } from "zod"

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive({ message: "O valor deve ser positivo" }),
  description: z.string().optional(),
  category_id: z.string().uuid({ message: "Selecione uma categoria" }),
  date: z.string().min(1, "Selecione uma data"),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
