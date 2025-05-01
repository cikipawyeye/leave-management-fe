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
import { Textarea } from '~/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PermitRepository } from '~/repositories/permit-repository'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Label } from '~/components/ui/label'
import InputError from '~/components/input-error'

const FormSchema = z.object({
  title: z.string().max(255),
  content: z.string(),
  type: z.enum(['sick', 'leave', 'other']),
  since: z.date(),
  until: z.date()
})

export default function CreatePermit() {
  const [open, setOpen] = useState(false)

  const repository = new PermitRepository()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'sick'
    }
  })

  const submit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await repository.store(data)

      flashSuccess('Permit created successfully')
      navigate('/permits/' + response.data.id)
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
          <Plus /> Create Permit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>Create Permit</DialogTitle>
              <DialogDescription>Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="mb-4 grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sick"> Sick </SelectItem>
                          <SelectItem value="leave"> Vacation Leave </SelectItem>
                          <SelectItem value="other"> Other </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="">
                <Label htmlFor="title" className="text-right">
                  Since
                </Label>

                <div className="col-span-3">
                  <input
                    type="datetime-local"
                    className="border-input selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    onChange={(e) => {
                      form.setValue('since', new Date(e.target.value))
                    }}
                  />

                  <InputError className="mt-2" message={form.formState.errors.since?.message} />
                </div>
              </div>
              <div className="">
                <Label htmlFor="title" className="text-right">
                  Until
                </Label>

                <div className="col-span-3">
                  <input
                    type="datetime-local"
                    className="border-input selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    onChange={(e) => {
                      form.setValue('until', new Date(e.target.value))
                    }}
                  />

                  <InputError className="mt-2" message={form.formState.errors.until?.message} />
                </div>
              </div>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little bit about permit" {...field} />
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
