import { Eye, EyeOff, LoaderCircle } from 'lucide-react'

import TextLink from '~/components/text-link'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import AuthLayout from '~/layouts/auth-layout'
import { Route } from './+types/register'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { useState } from 'react'
import { AuthRepository } from '~/repositories/auth-repository'
import { flashError, flashSuccess } from '~/support/helpers'
import { useNavigate } from 'react-router'

const FormSchema = z.object({
  name: z.string().max(255),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8)
})

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Register' }]
}

export default function Register() {
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false)

  const repository = new AuthRepository()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  })

  const submit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await repository.register(data)
      form.reset()
      flashSuccess(
        'Account created successfully',
        'Please wait while verificator is verifying your account'
      )
      navigate('/login')
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <Form {...form}>
        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-6">
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
                  {/* <InputError message={errors.name} className="mt-2" /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex w-full items-center gap-2">
                      <Input
                        {...field}
                        placeholder="Password"
                        type={passwordOpen ? 'text' : 'password'}
                      />
                      <Button
                        variant={'ghost'}
                        onClick={() => setPasswordOpen(!passwordOpen)}
                        type="button"
                      >
                        {!passwordOpen ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
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
                    <div className="flex w-full items-center gap-2">
                      <Input
                        {...field}
                        placeholder="Confirm password"
                        type={confirmPasswordOpen ? 'text' : 'password'}
                      />
                      <Button
                        variant={'ghost'}
                        onClick={() => setConfirmPasswordOpen(!confirmPasswordOpen)}
                        type="button"
                      >
                        {!confirmPasswordOpen ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-2 w-full"
              tabIndex={5}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </div>

          <div className="text-muted-foreground text-center text-sm">
            Already have an account?{' '}
            <TextLink to="/login" tabIndex={6}>
              Log in
            </TextLink>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}
