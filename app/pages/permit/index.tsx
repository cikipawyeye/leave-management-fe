import Heading from '~/components/heading'
import PaginationComponent from '~/components/pagination'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import AppLayout from '~/layouts/app-layout'
import { Pagination, Permit, type BreadcrumbItem } from '~/types'
import { Eye, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import CreatePermit from './partials/create'
import { PermitRepository } from '~/repositories/permit-repository'
import { debounce, flashError, stringToTitleCase } from '~/support/helpers'
import { Route } from './+types'
import { Link } from 'react-router'
import { usePermission } from '~/contexts/permission-context'
import { Permissions } from '~/Permission'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Permits' }]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard'
  },
  {
    title: 'Permits',
    href: '/permits'
  }
]

export default function Index() {
  const [permits, setPermits] = useState<Pagination<Permit>>()
  const [search, setSearch] = useState<string>()
  const [selectedTab, setSelectedTab] = useState('all')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('name')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const isFirstRender = useRef(true)
  const { hasPermission } = usePermission()
  const repository = new PermitRepository()

  const reloadData = async ({
    tab,
    search,
    sort,
    type
  }: {
    tab?: string
    search?: string
    sort?: string
    page?: number
    type?: string
  }) => {
    setLoading(true)
    await repository
      .paginate({
        state: tab,
        search,
        sort,
        type,
        page: currentPage ?? 1
      })
      .then((response) => {
        setPermits(response)
      })
      .catch((error) => flashError(error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    reloadData({ tab: selectedTab, search, sort, type })
  }, [selectedTab, search, sort, type])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    reloadData({ tab: selectedTab, search, sort, type, page: currentPage })
  }, [currentPage])

  const debouncedSetSearch = useMemo(() => debounce((value: string) => setSearch(value), 300), [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="px-4 py-6">
        <Heading title="Permit" description="Browse permit list" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            {hasPermission(Permissions.ADD_PERMIT) && <CreatePermit />}

            <Input
              defaultValue={search ?? ''}
              onChange={(el) => debouncedSetSearch(el.target.value)}
              className="h-9"
              type="search"
              placeholder="Search..."
            />

            <Select onValueChange={(value) => setSort(value)} value={sort}>
              <SelectTrigger className="h-9">
                <span className="text-muted-foreground">Sort by: </span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest"> Latest </SelectItem>
                <SelectItem value="oldest"> Oldest </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue={type}>
            <TabsList>
              <TabsTrigger onClick={() => setType('all')} value="all">
                All Type
              </TabsTrigger>
              <TabsTrigger onClick={() => setType('sick')} value="sick">
                Sick
              </TabsTrigger>
              <TabsTrigger onClick={() => setType('leave')} value="leave">
                Vacation
              </TabsTrigger>
              <TabsTrigger onClick={() => setType('other')} value="other">
                Other
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs defaultValue={selectedTab}>
            <TabsList>
              <TabsTrigger onClick={() => setSelectedTab('all')} value="all">
                All Status
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('pending')} value="pending">
                Pending
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('revision')} value="revision">
                Revision
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('approved')} value="approved">
                Approved
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('rejected')} value="rejected">
                Rejected
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('canceled')} value="canceled">
                Canceled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-7 overflow-x-auto">
          {loading && (
            <div className="flex items-center justify-center w-full py-16">
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </div>
          )}

          {!loading && permits && (
            <Table>
              <TableCaption>
                <PaginationComponent onPageChange={(page) => setCurrentPage(page)} data={permits} />
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="">User</TableHead>
                  <TableHead className="">Type</TableHead>
                  <TableHead className="">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permits?.data?.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell className="font-medium">{permit.user?.name}</TableCell>
                    <TableCell>{permit.type_label ?? stringToTitleCase(permit.type)}</TableCell>
                    <TableCell>{permit.title}</TableCell>
                    <TableCell>
                      {permit.state_label ?? stringToTitleCase(permit.state ?? '')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/permits/${permit.id}`}>
                        <Button variant={'link'}>
                          <Eye /> Detail
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {permits?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
