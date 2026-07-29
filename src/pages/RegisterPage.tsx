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
