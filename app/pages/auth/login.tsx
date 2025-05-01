import { LoaderCircle } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TextLink from '~/components/text-link'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import AuthLayout from '~/layouts/auth-layout'
import { Route } from './+types/login'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { useAuth } from '~/hooks/use-auth'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Log in' }]
}

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.boolean().optional()
})

export default function Login() {
  const { login } = useAuth()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '', remember: false }
  })

  const submit = async (data: z.infer<typeof FormSchema>) => {
    await login(data.email, data.password)
  }

  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <Form {...form}>
        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          return field.onChange(checked)
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                  </FormItem>
                )
              }}
            />

            <Button
              type="submit"
              className="mt-4 w-full"
              tabIndex={4}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Log in
            </Button>
          </div>

          <div className="text-muted-foreground text-center text-sm">
            Don't have an account?{' '}
            <TextLink to="/register" tabIndex={5}>
              Sign up
            </TextLink>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}
