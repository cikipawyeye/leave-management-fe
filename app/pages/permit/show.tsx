import Heading from '~/components/heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import AppLayout from '~/layouts/app-layout'
import { Permit, type BreadcrumbItem } from '~/types'
import EditPermit from './partials/edit'
import { Route } from './+types/show'
import { formatLocaleDate, stringToTitleCase } from '~/support/helpers'
import { PermitRepository } from '~/repositories/permit-repository'
import { usePermission } from '~/contexts/permission-context'
import { Permissions } from '~/Permission'
import CancelPermit from './partials/cancel-permit'
import DeletePermit from './partials/delete-permit'
import PermitReviews from './partials/permit-reviews'
import CreatePermitReview from './partials/create-permit-review'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Permit Detail' }]
}

const repository = new PermitRepository()

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { data } = await repository.show(params.id)

  return data
}

export default function Show({ loaderData }: Route.ComponentProps) {
  const data = loaderData as Permit

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard'
    },
    {
      title: 'Permits',
      href: '/permits'
    },
    {
      title: `#${data.id}`,
      href: `/permits/${data.id}`
    }
  ]

  const { hasPermission } = usePermission()

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="px-4 py-6">
        <Heading title="Permit Detail" description="View permit detail" />

        <div className="my-7 overflow-x-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <CardTitle>{data.user?.name ?? data.title}</CardTitle>
                  <CardDescription>{data.type_label ?? stringToTitleCase(data.type)}</CardDescription>
                </div>

                <div className="flex justify-end gap-2">
                  {hasPermission(Permissions.EDIT_PERMIT) &&
                    (data.state == 'pending' || data.state == 'revision') && (
                      <EditPermit permit={data} />
                    )}
                  {hasPermission(Permissions.SET_PERMIT_STATE_CANCELED) &&
                    (data.state == 'pending' || data.state == 'revision') && (
                      <CancelPermit permit={data} />
                    )}
                  {hasPermission(Permissions.DELETE_PERMIT) &&
                    (data.state == 'pending' ||
                      data.state == 'revision' ||
                      data.state == 'canceled') && <DeletePermit permit={data} />}
                  {hasPermission(Permissions.ADD_PERMIT_REVIEW) && data.state == 'pending' && (
                    <CreatePermitReview permit={data} />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <div className="mb-2">
                    <small>Title</small>
                    <p>{data.title}</p>
                  </div>
                  <div className="mb-2">
                    <small>Since</small>
                    <p>{data.since ? formatLocaleDate(data.since) : '-'}</p>
                  </div>
                  <div className="mb-2">
                    <small>Until</small>
                    <p>{data.until ? formatLocaleDate(data.until) : '-'}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <small>User</small>
                    <p>{data.user?.name}</p>
                  </div>
                  <div className="mb-2">
                    <small>Status</small>
                    <p>{data.state_label ?? stringToTitleCase(data.state ?? '-')}</p>
                  </div>
                  <div className="mb-2">
                    <small>Last update</small>
                    <p>{data.updated_at ? formatLocaleDate(data.updated_at) : '-'}</p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mb-2">
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                      {data.content?.split('\n').map((line, index) => (
                        <span key={index * 2}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </blockquote>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {hasPermission(Permissions.BROWSE_PERMIT_REVIEWS) && <PermitReviews permit={data} />}
      </div>
    </AppLayout>
  )
}
