import { getCategories } from "@/lib/actions/categories"
import { CategoryManager } from "@/components/categories/category-manager"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-primary px-5 pt-10 pb-5">
        <h1 className="text-white text-xl font-bold">Categorias</h1>
        <p className="text-blue-200 text-sm mt-1">Gerencie suas categorias de transações</p>
      </div>
      <div className="px-4 py-4">
        <CategoryManager categories={categories} />
      </div>
    </div>
  )
}
