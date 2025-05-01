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
import { Pagination, User, type BreadcrumbItem } from '~/types'
import { Eye, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { OrdinaryUserRepository } from '~/repositories/ordinary-user-repository'
import { debounce, flashError, formatLocaleDate } from '~/support/helpers'
import { Link } from 'react-router'
import { Route } from './+types'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Users' }]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard'
  },
  {
    title: 'Users',
    href: '/users'
  }
]

export default function Index() {
  const [users, setUsers] = useState<Pagination<User>>()
  const [search, setSearch] = useState<string>()
  const [selectedTab, setSelectedTab] = useState('all')
  const [sort, setSort] = useState('name')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const isFirstRender = useRef(true)
  const repository = new OrdinaryUserRepository()

  const reloadData = async ({
    tab,
    search,
    sort
  }: {
    tab?: string
    search?: string
    sort?: string
    page?: number
  }) => {
    setLoading(true)
    await repository
      .paginate({
        verified: tab,
        search,
        sort,
        page: currentPage ?? 1
      })
      .then((response) => {
        setUsers(response)
      })
      .catch((error) => flashError(error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    reloadData({ tab: selectedTab, search, sort })
  }, [selectedTab, search, sort])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    reloadData({ tab: selectedTab, search, sort, page: currentPage })
  }, [currentPage])

  const debouncedSetSearch = useMemo(() => debounce((value: string) => setSearch(value), 300), [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="px-4 py-6">
        <Heading title="Users" description="Browse user list" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
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
                <SelectItem value="name"> Name </SelectItem>
                <SelectItem value="latest"> Latest </SelectItem>
                <SelectItem value="oldest"> Oldest </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue={selectedTab}>
            <TabsList>
              <TabsTrigger onClick={() => setSelectedTab('all')} value="all">
                All Status
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('verified')} value="verified">
                Verified
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('unverified')} value="unverified">
                Unverified
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

          {!loading && users && (
            <Table>
              <TableCaption>
                <PaginationComponent onPageChange={(page) => setCurrentPage(page)} data={users} />
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="">Name</TableHead>
                  <TableHead className="">Email</TableHead>
                  <TableHead>Registered at</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.data?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatLocaleDate(user.created_at)}</TableCell>
                    <TableCell>{user.email_verified_at ? 'Verified' : 'Unverified'}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/ordinary-users/${user.id}`}>
                        <Button variant={'link'}>
                          <Eye /> Detail
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {users?.data.length === 0 && (
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
