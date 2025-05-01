import { Button } from '~/components/ui/button'
import { Route } from './+types/waiting-verification'
import AuthLayoutTemplate from '~/layouts/auth/auth-simple-layout'
import { useAuth } from '~/hooks/use-auth'
import { useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { AuthRepository } from '~/repositories/auth-repository'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Account verification' }]
}

export default function WaitingForVerification() {
  const { user, loading, logout } = useAuth()
  const repository = new AuthRepository()

  useEffect(() => {
    if (!loading && user?.email_verified_at) {
      window.location.href = '/dashboard'
    }
  }, [user])

  const form = useForm()

  const sendLink = async () => {
    await repository.sendEmailVerification()
  }

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center h-screen w-full">
          <LoaderCircle className="h-6 w-6 animate-spin" />
        </div>
      )}

      {user?.role == 'user' && (
        <AuthLayoutTemplate
          title="Waiting for account verification"
          description="Please wait for your account to be verified. You can login to your account once it is verified."
        >
          <div className="space-y-6 text-center">
            <Button variant={'link'} onClick={logout} className="mx-auto block text-sm">
              Log out
            </Button>
          </div>
        </AuthLayoutTemplate>
      )}

      {user?.role == 'verificator' && (
        <AuthLayoutTemplate
          title="Verify email"
          description="Please verify your email address by clicking on the link we just emailed to you."
        >
          {form.formState.isSubmitSuccessful && (
            <div className="mb-4 text-center text-sm font-medium text-green-600">
              A new verification link has been sent to the email address you provided during
              registration.
            </div>
          )}

          <form onSubmit={form.handleSubmit(sendLink)} className="space-y-6 text-center">
            <Button disabled={form.formState.isSubmitting} variant="secondary">
              {form.formState.isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Resend verification email
            </Button>

            <Button variant={'link'} onClick={logout} className="mx-auto block text-sm">
              Log out
            </Button>
          </form>
        </AuthLayoutTemplate>
      )}
    </>
  )
}
