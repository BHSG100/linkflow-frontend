# Spec: Login Interface — LinkFlow

## Objective

Build the authentication interface for LinkFlow, a real-world product. Users can register and log in to access the app. First version, production-quality.

## Tech Stack

- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router v6
- fetch (nativo, sem axios)

## API

Base URL: `https://linkflow-backend-ubym.onrender.com`

### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{ "email": string, "password": string }

Response 200: { token: string, user: { id: string, username: string, email: string } }
```

### Register

```
POST /api/v1/auth/register
Content-Type: application/json

{ "username": string, "email": string, "password": string }

Response 201: { token: string, user: { id: string, username: string, email: string } }
```

## Commands

```
Dev:  npm run dev
Build: npm run build
Lint: npm run lint
```

## Project Structure

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

## Routes

| Path | Component | Description |
|---|---|---|
| `/login` | LoginPage | Login form |
| `/register` | RegisterPage | Registration form |
| `/dashboard` | DashboardPage | Placeholder pós-login |
| `*` | redirect | Para `/login` |

## Component Tree

```
App (Router)
├── LoginPage
│   └── Card
│       └── LoginForm
│           ├── Input (email)
│           ├── Input (password)
│           └── Button (submit)
├── RegisterPage
│   └── Card
│       └── RegisterForm
│           ├── Input (username)
│           ├── Input (email)
│           ├── Input (password)
│           ├── Input (confirm password)
│           └── Button (submit)
└── DashboardPage
    └── Placeholder content
```

## Data Flow

1. User submits form → hook `useAuth.login(email, password)` ou `useAuth.register(username, email, password)`
2. Hook chama `api.login()` ou `api.register()` → fetch para API
3. Sucesso: hook salva token no `localStorage`, seta estado `user`, redireciona para `/dashboard`
4. Erro: hook retorna mensagem de erro → exibida no formulário

## Code Style

- Functional components com hooks
- Props tipadas com interface
- Nomes em camelCase
- Tailwind classes utilitárias (sem CSS modules)
- fetch wrapper centralizado em `api.ts` com `Authorization` header automático

## Testing Strategy

- Validação client-side inline nos formulários
- Testes manuais no navegador (primeira versão)

## Boundaries

- **Always:** Validar campos antes de enviar, exibir loading states, tratar erros da API
- **Ask first:** Adicionar dependências, mudar estrutura de rotas
- **Never:** Expor token no console/log, commit de secrets, pular validação

## Success Criteria

- [ ] Usuário consegue se cadastrar com username + email + senha
- [ ] Usuário consegue logar com email + senha
- [ ] Token é armazenado no localStorage
- [ ] Usuário logado é redirecionado ao `/dashboard`
- [ ] Erros da API são exibidos ao usuário
- [ ] Interface responsiva (mobile + desktop)
- [ ] Loading states visíveis durante requisições
