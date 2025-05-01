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
import { Permit } from '~/types'
import { Trash, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { flashError, flashSuccess } from '~/support/helpers'
import { useNavigate } from 'react-router'
import { PermitRepository } from '~/repositories/permit-repository'

export default function DeletePermit({ permit }: Readonly<{ permit: Permit }>) {
  const [open, setOpen] = useState(false)
  const repository = new PermitRepository()

  const form = useForm()
  const navigate = useNavigate()

  const submit = async () => {
    try {
      await repository.destroy(permit.id!)
      setOpen(false)
      flashSuccess('Permit deleted successfully')
      navigate(`/permits`)
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size="sm">
          <Trash /> Delete Permit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(submit)}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please confirm that you want to delete this permit.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={'destructive'} disabled={form.formState.isSubmitting} type="submit">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
