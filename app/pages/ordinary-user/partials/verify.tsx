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
import { User } from '~/types'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { OrdinaryUserRepository } from '~/repositories/ordinary-user-repository'
import { flashError, flashSuccess } from '~/support/helpers'
import { useNavigate } from 'react-router'

export default function Verify({ user }: Readonly<{ user: User }>) {
  const [open, setOpen] = useState(false)
  const repository = new OrdinaryUserRepository()

  const form = useForm()
  const navigate = useNavigate()

  const submit = async () => {
    try {
      repository.verifyAccount(user.id!)
      setOpen(false)
      flashSuccess('User role updated successfully')
      navigate(`/ordinary-users/${user.id}`)
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'} size="sm">
          <Check /> Verify User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(submit)}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please confirm that you want to verify this user.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={form.formState.isSubmitting} type="submit">
              Verify this user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
