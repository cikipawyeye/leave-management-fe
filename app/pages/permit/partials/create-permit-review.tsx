import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flashError, flashSuccess } from '~/support/helpers'
import { useNavigate } from 'react-router'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { PermitReviewRepository } from '~/repositories/permit-review-repository'
import { Permit } from '~/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { DialogDescription } from '@radix-ui/react-dialog'

const FormSchema = z.object({
  permit_id: z.number(),
  state: z.string(),
  comment: z.string().nullable()
})

export default function CreatePermitReview({ permit }: Readonly<{ permit: Permit }>) {
  const [open, setOpen] = useState(false)

  const repository = new PermitReviewRepository()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      permit_id: permit.id,
      state: 'approved',
      comment: null
    }
  })

  const submit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await repository.store(data)

      flashSuccess('Permit review created successfully')
      navigate('/permits/' + permit.id)
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
        <Button variant={'default'} size="sm">
          <Plus /> Action
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>Action</DialogTitle>
              <DialogDescription>
                Click save when you're done. This will create a new permit review.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4 grid gap-4 py-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permit Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved"> Approved </SelectItem>
                          <SelectItem value="rejected"> Rejected </SelectItem>
                          <SelectItem value="revision"> Revision </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        onChange={field.onChange}
                        placeholder="Describe about this permit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
