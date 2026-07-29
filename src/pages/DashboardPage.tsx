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
