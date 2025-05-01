import { FormEventHandler, useRef } from 'react'

import InputError from '~/components/input-error'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import HeadingSmall from '~/components/heading-small'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '~/components/ui/form'
import { SettingRepository } from '~/repositories/setting-repository'

const FormSchema = z.object({
  password: z.string()
})

export default function DeleteUser() {
  const repository = new SettingRepository()
  const passwordInput = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: ''
    }
  })

  const deleteUser = async (data: z.infer<typeof FormSchema>) => {
    repository
      .updateProfile(form.getValues('password'), form.getValues('email'))
      .catch((error) => flashError(error))
  }

  const closeModal = () => {
    clearErrors()
    reset()
  }

  return (
    <div className="space-y-6">
      <HeadingSmall
        title="Delete account"
        description="Delete your account and all of its resources"
      />
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">Warning</p>
          <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            <DialogDescription>
              Once your account is deleted, all of its resources and data will also be permanently
              deleted. Please enter your password to confirm you would like to permanently delete
              your account.
            </DialogDescription>

            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(deleteUser)}>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    name="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                  />

                  <InputError message={errors.password} />
                </div>

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="secondary" onClick={closeModal}>
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button variant="destructive" disabled={processing} asChild>
                    <button type="submit">Delete account</button>
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
