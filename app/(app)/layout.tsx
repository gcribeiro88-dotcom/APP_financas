import { BottomNav } from "@/components/layout/bottom-nav"
import { getCategories } from "@/lib/actions/categories"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">{children}</main>
      <BottomNav categories={categories} />
    </div>
  )
}
