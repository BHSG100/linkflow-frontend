# LinkFlow Frontend

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router v6
- fetch nativo (sem axios)

## Setup

No env vars needed — API URL is hardcoded in `src/lib/api.ts`.

## Commands

- `npm run dev` — Dev server
- `npm run build` — `tsc && vite build` (typecheck + bundle)
- `npm run lint` — ESLint with `--max-warnings 0` (fails on any warning)

## Projeto

Frontend de autenticação do LinkFlow. Consome API em `https://linkflow-backend-ubym.onrender.com`.

### Endpoints

- `POST /api/v1/auth/login` — `{ email, password }` → `{ token, user }`
- `POST /api/v1/auth/register` — `{ username, email, password }` → `{ token, user }`

## Estrutura

```
src/
├── components/
│   ├── ui/          # Input, Button, Card
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── lib/
│   └── api.ts       # fetch wrapper, endpoints
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── hooks/
│   └── useAuth.ts   # login, register, logout + localStorage state
├── App.tsx          # BrowserRouter: /login, /register, /dashboard, /* → /login
├── main.tsx
└── index.css        # @tailwind directives
```

## Conventions

- Componentes funcionais com hooks
- Props tipadas com interface
- camelCase
- Tailwind utilitário (sem CSS modules)
- fetch wrapper centralizado com Authorization header
- Token JWT em localStorage (keys: `linkflow_token`, `linkflow_user`)
- Mensagens em português
- tsconfig strict: `strict: true`, `noUnusedLocals`, `noUnusedParameters`

## Branches

- `develop` — Trabalho ativo
