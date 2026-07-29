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

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Erro de conexão. Verifique sua internet.')
  }

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
