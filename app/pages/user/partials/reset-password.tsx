import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { User } from '~/types'
import { Eye, EyeOff, Key } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { UserRepository } from '~/repositories/user-repository'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flashError, flashSuccess } from '~/support/helpers'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'

const FormSchema = z
  .object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    password_confirmation: z.string().min(8, { message: 'Password confirmation is required' })
  })
  
export default function ResetUserPassword({ user }: Readonly<{ user: User }>) {
  const [open, setOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false)

  const repository = new UserRepository()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      password_confirmation: ''
    }
  })

  const submit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await repository.resetPassword(user.id!, data)
      form.reset()
      setOpen(false)
      flashSuccess('Password reset successfully')
    } catch (error) {
      flashError(error)
    }
  }

  useEffect(() => {
    if (open) {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size="sm">
          <Key /> Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>Reset User Password</DialogTitle>
              <DialogDescription>Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 mb-4">
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
            </div>
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
