import Heading from '~/components/heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import AppLayout from '~/layouts/app-layout'
import { User, type BreadcrumbItem } from '~/types'
import EditRole from './partials/edit-role'
import ResetUserPassword from './partials/reset-password'
import { Route } from './+types/show'
import { UserRepository } from '~/repositories/user-repository'
import { formatLocaleDate, stringToTitleCase } from '~/support/helpers'
import Permits from '~/pages/ordinary-user/partials/permits'
import { Permissions } from '~/Permission'
import { usePermission } from '~/contexts/permission-context'

const repository = new UserRepository()

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { data } = await repository.show(params.id)

  return data
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'User' }]
}

export default function ShowUser({ loaderData }: Route.ComponentProps) {
  const user = loaderData as User

  const { hasPermission } = usePermission()

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard'
    },
    {
      title: 'Users',
      href: '/users'
    },
    {
      title: user?.name ?? 'Detail',
      href: '/users/' + user?.id
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="px-4 py-6">
        <Heading title={user?.name ?? 'User Detail'} description="View user detail" />

        <div className="mt-7 overflow-x-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <CardTitle>Account Detail</CardTitle>
                  <CardDescription>{user?.name}</CardDescription>
                </div>

                {user && (
                  <div className="flex justify-end gap-2">
                    {user.role != 'admin' && <EditRole user={user} />}
                    <ResetUserPassword user={user} />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <div className="mb-2">
                    <small>Name</small>
                    <p>{user?.name}</p>
                  </div>
                  <div className="mb-2">
                    <small>Email</small>
                    <p>{user?.email}</p>
                  </div>
                  <div className="mb-2">
                    <small>Role</small>
                    <p>{stringToTitleCase(user?.role ?? '-')}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <small>Registered at</small>
                    <p>{user?.created_at ? formatLocaleDate(user?.created_at) : '-'}</p>
                  </div>
                  <div className="mb-2">
                    <small>Verified at</small>
                    <p>
                      {user?.email_verified_at
                        ? formatLocaleDate(user?.email_verified_at)
                        : 'Not verified yet'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {hasPermission(Permissions.BROWSE_PERMITS) && <Permits user={user} />}
      </div>
    </AppLayout>
  )
}
