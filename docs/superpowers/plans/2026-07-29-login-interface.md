# Login Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authentication UI (login + register) for LinkFlow, ready to consume the real API.

**Architecture:** React SPA with Vite, Tailwind CSS, and React Router v6. Auth state managed via custom hook with localStorage token persistence. Fetch wrapper centralizes API calls and Authorization header.

**Tech Stack:** React 18, Vite 5, TypeScript, Tailwind CSS, React Router v6

## Global Constraints

- React 18 + Vite + TypeScript
- Tailwind CSS for styling (no CSS modules, no styled-components)
- React Router v6 for routing
- fetch nativo (sem axios)
- Token JWT armazenado no localStorage
- Nomes em camelCase
- Componentes funcionais com hooks
- Props tipadas com interface
- Mensagens de erro em português

---

### Task 1: Scaffold Project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "linkflow-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 6: Create postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Create index.html**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LinkFlow</title>
  </head>
  <body class="bg-gray-50 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 9: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 10: Create src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 11: Install dependencies**

Run: `npm install`

---

### Task 2: API Client

**Files:**
- Create: `src/lib/api.ts`

**Interfaces:**
- Produces: `apiClient` object with `login(email, password)`, `register(username, email, password)` methods, and `api` fetch wrapper with automatic `Authorization` header

- [ ] **Step 1: Create src/lib/api.ts**

```ts
const BASE_URL = 'https://linkflow-backend-ubym.onrender.com'

interface User {
  id: string
  username: string
  email: string
}

interface AuthResponse {
  token: string
  user: User
}

interface ApiError {
  message: string
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('linkflow_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: 'Erro inesperado. Tente novamente.',
    }))
    throw new Error(error.message)
  }

  return res.json()
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}
```

---

### Task 3: UI Components (Input, Button, Card)

**Files:**
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`

**Interfaces:**
- Produces: `Input` (props: label, error?, type?, ...inputProps), `Button` (props: loading?, children, ...buttonProps), `Card` (props: children, title?)

- [ ] **Step 1: Create src/components/ui/Input.tsx**

```tsx
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? 'border-red-400 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/ui/Button.tsx**

```tsx
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export default function Button({
  children,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Carregando…
        </span>
      ) : (
        children
      )}
    </button>
  )
}
```

- [ ] **Step 3: Create src/components/ui/Card.tsx**

```tsx
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title: string
}

export default function Card({ children, title }: CardProps) {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        {title}
      </h1>
      {children}
    </div>
  )
}
```

---

### Task 4: Auth Hook

**Files:**
- Create: `src/hooks/useAuth.ts`

**Interfaces:**
- Consumes: `login`, `register` from `src/lib/api.ts`
- Produces: `useAuth()` returning `{ user, token, loading, login, register, logout }`

- [ ] **Step 1: Create src/hooks/useAuth.ts**

```ts
import { useState, useCallback } from 'react'
import { login as apiLogin, register as apiRegister } from '../lib/api'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

export default function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('linkflow_token')
    const stored = localStorage.getItem('linkflow_user')
    return {
      token,
      user: stored ? JSON.parse(stored) : null,
      loading: false,
    }
  })

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const data = await apiLogin(email, password)
      localStorage.setItem('linkflow_token', data.token)
      localStorage.setItem('linkflow_user', JSON.stringify(data.user))
      setState({ user: data.user, token: data.token, loading: false })
      return data
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false }))
      throw err
    }
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true }))
      try {
        const data = await apiRegister(username, email, password)
        localStorage.setItem('linkflow_token', data.token)
        localStorage.setItem('linkflow_user', JSON.stringify(data.user))
        setState({ user: data.user, token: data.token, loading: false })
        return data
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false }))
        throw err
      }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem('linkflow_token')
    localStorage.removeItem('linkflow_user')
    setState({ user: null, token: null, loading: false })
  }, [])

  return { ...state, login, register, logout }
}
```

---

### Task 5: Login Form

**Files:**
- Create: `src/components/LoginForm.tsx`

**Interfaces:**
- Consumes: `login` from `useAuth` hook
- Produces: `<LoginForm onSuccess: () => void>`

- [ ] **Step 1: Create src/components/LoginForm.tsx**

```tsx
import { FormEvent, useState } from 'react'
import Input from './ui/Input'
import Button from './ui/Button'
import useAuth from '../hooks/useAuth'

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const { login, loading } = useAuth()

  function validate() {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Email é obrigatório'
    if (!password) e.password = 'Senha é obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro inesperado')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <Input
        id="password"
        label="Senha"
        type="password"
        placeholder="Sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <Button type="submit" loading={loading}>
        Entrar
      </Button>
    </form>
  )
}
```

---

### Task 6: Register Form

**Files:**
- Create: `src/components/RegisterForm.tsx`

**Interfaces:**
- Consumes: `register` from `useAuth` hook
- Produces: `<RegisterForm onSuccess: () => void>`

- [ ] **Step 1: Create src/components/RegisterForm.tsx**

```tsx
import { FormEvent, useState } from 'react'
import Input from './ui/Input'
import Button from './ui/Button'
import useAuth from '../hooks/useAuth'

interface RegisterFormProps {
  onSuccess: () => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const { register, loading } = useAuth()

  function validate() {
    const e: Record<string, string> = {}
    if (!username || username.length < 3)
      e.username = 'Username deve ter pelo menos 3 caracteres'
    if (!email) e.email = 'Email é obrigatório'
    if (!password || password.length < 8)
      e.password = 'Senha deve ter pelo menos 8 caracteres'
    if (!/[0-9]/.test(password))
      e.password = 'Senha deve conter pelo menos um número'
    if (!/[^a-zA-Z0-9]/.test(password))
      e.password = 'Senha deve conter pelo menos um caractere especial'
    if (password !== confirmPassword)
      e.confirmPassword = 'Senhas não conferem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    try {
      await register(username, email, password)
      onSuccess()
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro inesperado')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <Input
        id="username"
        label="Username"
        type="text"
        placeholder="seu_usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
      />

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <Input
        id="password"
        label="Senha"
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <Input
        id="confirmPassword"
        label="Confirmar Senha"
        type="password"
        placeholder="Repita a senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />

      <Button type="submit" loading={loading}>
        Criar Conta
      </Button>
    </form>
  )
}
```

---

### Task 7: Pages and Routing

**Files:**
- Create: `src/pages/LoginPage.tsx`
- Create: `src/pages/RegisterPage.tsx`
- Create: `src/pages/DashboardPage.tsx`
- Modify: `src/App.tsx` (create)

**Interfaces:**
- Consumes: `LoginForm`, `RegisterForm`, `Card`, `useAuth`
- Produces: Routes setup with redirect logic

- [ ] **Step 1: Create src/pages/LoginPage.tsx**

```tsx
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card title="LinkFlow">
        <LoginForm onSuccess={() => navigate('/dashboard')} />
        <p className="mt-4 text-center text-sm text-gray-600">
          Ainda não tem conta?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create src/pages/RegisterPage.tsx**

```tsx
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card title="Criar Conta">
        <RegisterForm onSuccess={() => navigate('/dashboard')} />
        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Create src/pages/DashboardPage.tsx**

```tsx
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Button from '../components/ui/Button'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.username}!
        </h1>
        <p className="mb-6 text-gray-600">Você está logado no LinkFlow.</p>
        <Button onClick={handleLogout}>Sair</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create src/App.tsx**

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

### Task 8: Final Verification

- [ ] **Step 1: Build the project**

Run: `npm run build`

Expected: Compilation succeeds, output in `dist/`

- [ ] **Step 2: Verify dev server starts**

Run: `npm run dev`

Expected: Dev server starts on localhost, pages render correctly
