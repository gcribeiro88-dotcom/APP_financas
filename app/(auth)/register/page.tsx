"use client"

import { register } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useTransition } from "react"
import { DollarSign, MailCheck } from "lucide-react"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirm = formData.get("confirm_password") as string
    if (password !== confirm) {
      setError("As senhas não coincidem")
      return
    }
    setRegisteredEmail(formData.get("email") as string)
    startTransition(async () => {
      const result = await register(formData)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
            <MailCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Verifique seu e-mail</h1>
          <p className="text-muted-foreground text-sm mb-1">
            Enviamos um link de confirmação para:
          </p>
          <p className="font-semibold text-foreground mb-5">{registeredEmail}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-left space-y-2 mb-6">
            <p className="text-sm font-medium text-blue-800">O que fazer agora:</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Abra sua caixa de entrada</li>
              <li>Procure o e-mail de <span className="font-medium">FinançasPessoais</span></li>
              <li>Clique no link de confirmação</li>
              <li>Pronto! Você já pode entrar no app</li>
            </ol>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Não recebeu? Verifique também a pasta de spam ou lixo eletrônico.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">Ir para o login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">FinançasPessoais</h1>
          <p className="text-muted-foreground mt-1 text-sm">Crie sua conta gratuitamente</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-5">Criar conta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome"
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Confirmar senha</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
