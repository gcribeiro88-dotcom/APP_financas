import { getTransactions } from "@/lib/actions/transactions"
import { getCategories } from "@/lib/actions/categories"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { getCurrentMonth } from "@/lib/utils"

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string; category?: string; type?: string }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const now = getCurrentMonth()
  const year = Number(params.year) || now.year
  const month = Number(params.month) || now.month
  const categoryId = params.category || ""
  const type = params.type || ""

  const [transactions, categories] = await Promise.all([
    getTransactions(year, month, categoryId || undefined, type || undefined),
    getCategories(),
  ])

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-primary px-5 pt-10 pb-5">
        <h1 className="text-white text-xl font-bold mb-4">Extratos</h1>
        <TransactionFilters
          year={year}
          month={month}
          categories={categories}
          selectedCategory={categoryId}
          selectedType={type}
        />
      </div>

      <div className="px-4 py-4">
        <TransactionList transactions={transactions} categories={categories} />
      </div>
    </div>
  )
}
