import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthRepository } from '~/repositories/auth-repository'
import { User } from '~/types'
import { flashError } from '~/support/helpers'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

const repository = new AuthRepository()

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)

    const token = localStorage.getItem('token')
    if (token) {
      repository
        .profile()
        .then((res) => (res.data ? setUser(res.data) : logout()))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data } = await repository.login(email, password)
      const token = data!.token
      localStorage.setItem('token', token)

      const userRes = await repository.profile()
      setUser(userRes!.data!)
    } catch (error) {
      flashError(error)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('token')

      setUser(null)
      navigate('/login')

      repository.logout()
      return null
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
