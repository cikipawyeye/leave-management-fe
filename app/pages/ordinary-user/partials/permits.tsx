import PaginationComponent from '~/components/pagination'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { Pagination, Permit, PermitReview, User } from '~/types'
import { Eye, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { flashError, formatLocaleDate, stringToTitleCase } from '~/support/helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { PermitRepository } from '~/repositories/permit-repository'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'

export default function Permits({ user }: Readonly<{ user: User }>) {
  const [permits, setPermits] = useState<Pagination<Permit>>()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const isFirstRender = useRef(true)
  const repository = new PermitRepository()

  const reloadData = async (page = 1) => {
    setLoading(true)
    await repository
      .paginate({
        user: user.id,
        page
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

    reloadData(currentPage)
  }, [currentPage])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permits</CardTitle>
        <CardDescription>
          {permits?.meta?.total} permit{(permits?.meta?.total ?? 0) > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                <TableHead>Date</TableHead>
                <TableHead className="">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permits?.data?.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell>{formatLocaleDate(permit.created_at)}</TableCell>
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
      </CardContent>
    </Card>
  )
}
