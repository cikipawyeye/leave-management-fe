import { type BreadcrumbItem } from '~/types'

import HeadingSmall from '~/components/heading-small'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import AppLayout from '~/layouts/app-layout'
import SettingsLayout from '~/layouts/settings/layout'
import { Route } from './+types/profile'
import { useAuth } from '~/hooks/use-auth'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingRepository } from '~/repositories/setting-repository'
import { flashError, flashSuccess } from '~/support/helpers'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Profile settings' }]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile'
  }
]

const FormSchema = z.object({
  name: z.string().max(255),
  email: z.string().email()
})

export default function Profile() {
  const repository = new SettingRepository()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email
    }
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const submit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await repository.updateProfile(data.name, data.email)
      flashSuccess('Profile updated successfully')
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Profile information"
            description="Update your name and email address"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* {user?.email_verified_at === null && (
                <div>
                  <p className="text-muted-foreground -mt-4 text-sm">
                    Your email address is unverified.{' '}
                    <Link
                      href={route('verification.send')}
                      method="post"
                      as="button"
                      className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                    >
                      Click here to resend the verification email.
                    </Link>
                  </p>

                  {status === 'verification-link-sent' && (
                    <div className="mt-2 text-sm font-medium text-green-600">
                      A new verification link has been sent to your email address.
                    </div>
                  )}
                </div>
              )} */}

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
