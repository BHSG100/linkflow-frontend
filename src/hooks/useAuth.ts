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
