# FinançasPessoais — Design Spec
**Data:** 2026-05-21  
**Status:** Aprovado

---

## 1. Visão Geral

Web app de gestão financeira pessoal que permite ao usuário registrar receitas e despesas, categorizá-las e visualizar um dashboard mensal com resumo e gráfico por categoria. Interface mobile-first inspirada nos apps brasileiros Mobills/Organizze.

---

## 2. Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14+ (App Router) |
| Linguagem | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Gráficos | Recharts (Bar Chart) |
| Backend/Auth | Supabase (PostgreSQL + Auth + RLS) |
| Deploy | Vercel |
| Validação | Zod |

---

## 3. Arquitetura

### Padrão: Server Components + Server Actions

- **Server Components** buscam dados diretamente do Supabase no servidor (sem exposição de service key ao cliente)
- **Server Actions** executam mutações (criar/editar/excluir transações, gerenciar categorias)
- **Middleware** (`middleware.ts`) protege todas as rotas de `(app)/*`, redirecionando usuários não autenticados para `/login`
- **Cookies httpOnly** gerenciam a sessão do Supabase Auth
- **RLS** garante isolamento completo de dados entre usuários

### Fluxo de dados

```
Browser → clica "Salvar" → Server Action → valida (Zod) → Supabase INSERT (RLS check) → revalida cache → re-render
Browser → navega para /dashboard → Server Component → SELECT Supabase → renderiza HTML no servidor
```

### Estrutura de Rotas

```
app/
  (auth)/
    login/page.tsx         # Tela de login (email/senha)
    register/page.tsx      # Tela de cadastro
  (app)/
    layout.tsx             # Layout com Bottom Nav
    dashboard/page.tsx     # Dashboard principal
    transactions/page.tsx  # Lista de transações
    categories/page.tsx    # Gerenciar categorias
    profile/page.tsx       # Perfil e logout
  middleware.ts            # Auth guard
  layout.tsx               # Root layout (providers, fonts)
lib/
  supabase/
    server.ts              # Client para Server Components/Actions
    client.ts              # Client para Client Components
  actions/
    transactions.ts        # Server Actions de transações
    categories.ts          # Server Actions de categorias
  validations/
    transaction.ts         # Schemas Zod
    category.ts
components/
  ui/                      # shadcn/ui components
  layout/
    bottom-nav.tsx         # Navegação inferior
  dashboard/
    summary-cards.tsx      # Cards de receitas/despesas/saldo
    category-bar-chart.tsx # Recharts bar chart
    recent-transactions.tsx
  transactions/
    transaction-list.tsx
    transaction-filters.tsx
    transaction-form.tsx   # Formulário add/edit
  categories/
    category-list.tsx
    category-form.tsx
```

---

## 4. Banco de Dados

### Tabelas

**`categories`**
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES auth.users  -- null = categoria padrão
name        text NOT NULL
type        text CHECK (type IN ('income', 'expense', 'both'))
color       text                         -- hex color para UI
is_default  boolean DEFAULT false
created_at  timestamptz DEFAULT now()
```

**`transactions`**
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES auth.users NOT NULL
category_id uuid REFERENCES categories
type        text CHECK (type IN ('income', 'expense')) NOT NULL
amount      numeric(12,2) NOT NULL
date        date NOT NULL
description text
created_at  timestamptz DEFAULT now()
```

### Row Level Security

**categories:**
- `SELECT`: `user_id = auth.uid() OR user_id IS NULL` (categorias padrão têm `user_id = null`)
- `INSERT/UPDATE/DELETE`: `user_id = auth.uid()`

**transactions:**
- `SELECT/INSERT/UPDATE/DELETE`: `user_id = auth.uid()`

### Categorias Padrão (seed)

| Tipo | Categorias |
|------|-----------|
| Despesa | Alimentação, Transporte, Saúde, Moradia, Lazer, Educação, Vestuário, Outros |
| Receita | Salário, Freelance, Investimentos, Presente, Outros |

Inseridas com `is_default = true` e `user_id = null`.

---

## 5. Telas e Componentes

### Navegação — Bottom Nav (5 itens)

| Item | Ícone | Rota | Comportamento |
|------|-------|------|---------------|
| Início | Home | `/dashboard` | Página ativa |
| Extratos | List | `/transactions` | Lista com filtros |
| **+** | Plus (FAB) | — | Abre modal de nova transação |
| Categorias | Tag | `/categories` | Lista + criar/editar |
| Perfil | User | `/profile` | Dados e logout |

No desktop (≥ 768px): sidebar lateral substitui o bottom nav.

### `/login` e `/register`
- Formulário centralizado com logo
- Email + senha + botão de ação
- Link de alternância entre login e cadastro
- Feedback de erro inline (toast ou mensagem abaixo do campo)

### `/dashboard`
- **Header:** saudação com nome do usuário + seletor de mês (← Mês →)
- **Card de Saldo:** destaque com saldo do mês, receitas e despesas em linha
- **Bar Chart (Recharts):** despesas por categoria no mês selecionado, barras ordenadas por valor decrescente
- **Transações Recentes:** últimas 5 transações com categoria, data e valor colorido

### `/transactions`
- **Filtros:** seletor de mês + dropdown de categoria + toggle Receita/Despesa/Todos
- **Lista:** itens ordenados por data decrescente, agrupados por dia
- Cada item: ícone de categoria + descrição + categoria + data + valor
- Ações por item: editar (ícone lápis) + excluir (ícone lixeira, com confirmação)

### Modal — Nova / Editar Transação
- Toggle **Despesa / Receita** no topo (muda cor do header)
- Campos: Valor (R$), Descrição, Categoria (select), Data
- Botão "Salvar" → Server Action → fecha modal → revalida dados
- Validação client-side com Zod antes de submeter

### `/categories`
- Lista de categorias do usuário + categorias padrão (marcadas)
- Criar nova: nome + tipo + cor (color picker simples)
- Editar/excluir categorias próprias (padrão são read-only)

### `/profile`
- Nome/email do usuário
- Botão de Logout

---

## 6. Design Language

- **Paleta:** Azul profissional (`#1e40af` primário, `#3b82f6` acento, `#bfdbfe` suave)
- **Receitas:** Verde (`#16a34a`)
- **Despesas:** Vermelho (`#dc2626`)
- **Neutros:** Slate (`#f8fafc` bg, `#e2e8f0` bordas, `#1e293b` texto)
- **Tipografia:** Inter (sans-serif), sem serifas
- **Bordas:** Raio 8px nos cards, 4-6px nos inputs
- **Sombras:** Suaves (`shadow-sm`), sem exagero
- **Mobile-first:** breakpoint `md:` para desktop

---

## 7. Requisitos Não-Funcionais

- **Autenticação:** Apenas email/senha via Supabase Auth
- **Isolamento:** RLS garante que cada usuário vê somente seus dados
- **Localização:** pt-BR — moeda em `R$`, datas em `dd/MM/yyyy`
- **Responsividade:** funciona em 375px (mobile) até 1440px (desktop)
- **Sem export:** exportação de relatórios fora do escopo desta versão

---

## 8. Fora do Escopo

- Exportação de relatórios (CSV/PDF)
- Metas de economia
- Contas bancárias / múltiplas carteiras
- Notificações / lembretes
- Modo escuro
- Login social (Google, GitHub)
