import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '~/hooks/use-auth'
import AuthLayoutTemplate from '~/layouts/auth/auth-simple-layout'

export default function AuthLayout({
  children,
  title,
  description,
  ...props
}: Readonly<{ children: React.ReactNode; title: string; description: string }>) {
  const { isAuthenticated, loading } = useAuth()
  let navigate = useNavigate()

  useEffect(() => {
    if (loading) {
      return
    }
    
    if (isAuthenticated) {
      navigate('/dashboard')
    }

  }, [isAuthenticated, loading, navigate])

  return (
    <AuthLayoutTemplate title={title} description={description} {...props}>
      {children}
    </AuthLayoutTemplate>
  )
}
