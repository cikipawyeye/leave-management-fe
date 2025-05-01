import AppLayoutTemplate from '~/layouts/app/app-sidebar-layout'
import { type BreadcrumbItem } from '~/types'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { useNavigate } from 'react-router'

interface AppLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { isAuthenticated, loading, user } = useAuth()
  let navigate = useNavigate()

  useEffect(() => {
    if (loading) {
      return
    }

    if (!isAuthenticated) {
      navigate('/login')
    }

    if (user && !user.email_verified_at) {
      navigate('/verify-account-notice')
    }
  }, [isAuthenticated, loading, navigate])

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
    </AppLayoutTemplate>
  )
}
