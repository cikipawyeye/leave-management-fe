import InputError from '~/components/input-error'
import AppLayout from '~/layouts/app-layout'
import SettingsLayout from '~/layouts/settings/layout'
import { type BreadcrumbItem } from '~/types'
import { FormEventHandler, useRef } from 'react'

import HeadingSmall from '~/components/heading-small'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { z } from 'zod'
import { SettingRepository } from '~/repositories/setting-repository'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { flashError, flashSuccess } from '~/support/helpers'
import { Route } from './+types/password'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Profile settings' }]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Password settings',
    href: '/settings/password'
  }
]

const FormSchema = z.object({
  current_password: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  password_confirmation: z.string().min(8, 'Password must be at least 8 characters long')
})

export default function Password() {
  const repository = new SettingRepository()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { current_password: '', password: '', password_confirmation: '' }
  })

  const updatePassword = async (data: z.infer<typeof FormSchema>) => {
    try {
      await repository.resetPassword(
        data.current_password,
        data.password,
        data.password_confirmation
      )
      flashSuccess('Password updated successfully')
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Update password"
            description="Ensure your account is using a long, random password to stay secure"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(updatePassword)} className="space-y-6">
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="New password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Save password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}
