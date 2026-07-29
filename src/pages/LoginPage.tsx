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
