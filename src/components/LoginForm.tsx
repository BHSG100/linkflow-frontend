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
