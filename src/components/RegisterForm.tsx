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
    if (!password || password.length < 8) {
      e.password = 'Senha deve ter pelo menos 8 caracteres'
    } else if (!/[0-9]/.test(password)) {
      e.password = 'Senha deve conter pelo menos um número'
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      e.password = 'Senha deve conter pelo menos um caractere especial'
    }
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
