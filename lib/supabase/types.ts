export type TransactionType = "income" | "expense"
export type CategoryType = "income" | "expense" | "both"

export interface Category {
  id: string
  user_id: string | null
  name: string
  type: CategoryType
  color: string
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  type: TransactionType
  amount: number
  date: string
  description: string | null
  created_at: string
  categories?: Category | null
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, "id" | "created_at">
        Update: Partial<Omit<Category, "id" | "created_at">>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, "id" | "created_at" | "categories">
        Update: Partial<Omit<Transaction, "id" | "created_at" | "categories">>
      }
    }
  }
}
