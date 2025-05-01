import InputError from '~/components/input-error'
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
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { User } from '~/types'
import { Pencil } from 'lucide-react'
import { FormEventHandler, useEffect, useState } from 'react'
import { UserRepository } from '~/repositories/user-repository'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { flashError, flashSuccess } from '~/support/helpers'
import { useNavigate } from 'react-router'

const FormSchema = z.object({
  role: z.string()
})

export default function EditRole({ user }: Readonly<{ user: User }>) {
  const [open, setOpen] = useState(false)
  const repository = new UserRepository()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { role: user.role }
  })

  const submit = async (data: z.infer<typeof FormSchema>) => {
    try {
      repository.update(user.id!, { role: data.role })
      form.reset()
      setOpen(false)
      flashSuccess('User role updated successfully')
      navigate(`/users/${user.id}`)
    } catch (error) {
      flashError(error)
    }
  }

  useEffect(() => {
    if (open) {
      form.reset({
        role: user.role
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} size="sm">
          <Pencil /> Change Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user"> Ordinary User </SelectItem>
                          <SelectItem value="verificator"> Verificator </SelectItem>
                        </SelectContent>
                      </Select>
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
