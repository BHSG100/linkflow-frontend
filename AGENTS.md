# LinkFlow Frontend

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router v6
- fetch nativo (sem axios)

## Commands

- `npm run dev` — Dev server
- `npm run build` — Build de produção
- `npm run lint` — Lint

## Projeto

Frontend de autenticação do LinkFlow. Consome API em `https://linkflow-backend-ubym.onrender.com`.

### Endpoints

- `POST /api/v1/auth/login` — `{ email, password }` → `{ token, user }`
- `POST /api/v1/auth/register` — `{ username, email, password }` → `{ token, user }`

## Estrutura

```
src/
├── components/
│   ├── ui/
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── lib/
│   └── api.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── hooks/
│   └── useAuth.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Convenções

- Componentes funcionais com hooks
- Props tipadas com interface
- camelCase
- Tailwind utilitário (sem CSS modules)
- fetch wrapper centralizado com Authorization header
- Token JWT em localStorage (keys: `linkflow_token`, `linkflow_user`)
- Mensagens em português

## Branches

- `develop` — Trabalho ativo
