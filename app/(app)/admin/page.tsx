import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

function formatDate(date: string | null | undefined) {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function getInitials(name: string | null, email: string) {
  if (name) return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  return email[0].toUpperCase()
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user?.email !== adminEmail) {
    redirect("/dashboard")
  }

  let users: any[] = []
  let fetchError: string | null = null

  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.auth.admin.listUsers()
    if (error) fetchError = error.message
    else users = data.users
  } catch (err: any) {
    fetchError = err.message
  }

  const confirmed = users.filter((u) => u.email_confirmed_at).length

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-primary px-5 pt-10 pb-12">
        <h1 className="text-white text-xl font-bold">Administração</h1>
        <p className="text-blue-200 text-sm mt-1">Usuários cadastrados</p>
      </div>

      <div className="px-4 -mt-6 pb-8">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total de usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{confirmed}</p>
              <p className="text-xs text-muted-foreground mt-1">E-mails confirmados</p>
            </CardContent>
          </Card>
        </div>

        {fetchError && (
          <Card className="mb-4 border-destructive/30">
            <CardContent className="p-4">
              <p className="text-sm text-destructive font-medium">Erro ao carregar usuários</p>
              <p className="text-xs text-muted-foreground mt-1">{fetchError}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Verifique se <code className="bg-muted px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> e{" "}
                <code className="bg-muted px-1 rounded">ADMIN_EMAIL</code> estão configurados.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {users.length === 0 && !fetchError ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Nenhum usuário encontrado.
              </div>
            ) : (
              users.map((u, i) => {
                const name = u.user_metadata?.name as string | undefined || null
                const initials = getInitials(name, u.email)
                const isConfirmed = !!u.email_confirmed_at

                return (
                  <div
                    key={u.id}
                    className={`flex items-start gap-3 px-4 py-4 ${i < users.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{initials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {name || u.email}
                        </p>
                        {isConfirmed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      {name && (
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      )}
                      <div className="flex gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(u.created_at)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {u.last_sign_in_at ? formatDate(u.last_sign_in_at) : "Nunca"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
