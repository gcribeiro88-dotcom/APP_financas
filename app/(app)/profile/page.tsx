import { createClient } from "@/lib/supabase/server"
import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, LogOut, Shield } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.name || "Usuário"
  const email = user?.email || ""
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
  const isAdmin = !!process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-primary px-5 pt-10 pb-12">
        <h1 className="text-white text-xl font-bold">Perfil</h1>
      </div>

      <div className="px-4 -mt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{initials}</span>
          </div>
          <h2 className="text-lg font-bold text-foreground mt-3">{name}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="text-sm font-medium text-foreground">{name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="text-sm font-medium text-foreground">{email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Link href="/admin" className="block mt-4">
            <Button variant="outline" className="w-full">
              <Shield className="w-4 h-4" />
              Painel de Administração
            </Button>
          </Link>
        )}

        <form action={logout} className="mt-4">
          <Button type="submit" variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-red-50">
            <LogOut className="w-4 h-4" />
            Sair da conta
          </Button>
        </form>
      </div>
    </div>
  )
}
