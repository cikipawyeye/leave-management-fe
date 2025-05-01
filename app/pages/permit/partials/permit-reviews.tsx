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
import { Pagination, Permit, PermitReview } from '~/types'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { flashError, formatLocaleDate, stringToTitleCase } from '~/support/helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { PermitReviewRepository } from '~/repositories/permit-review-repository'

export default function PermitReviews({ permit }: Readonly<{ permit: Permit }>) {
  const [permitReviews, setPermitReviews] = useState<Pagination<PermitReview>>()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const isFirstRender = useRef(true)
  const repository = new PermitReviewRepository()

  const reloadData = async (page = 1) => {
    setLoading(true)
    await repository
      .paginate({
        permit: permit.id,
        page
      })
      .then((response) => {
        setPermitReviews(response)
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
        <CardTitle>Permit Reviews</CardTitle>
        <CardDescription>{permitReviews?.meta?.total} reviews</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center w-full py-16">
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </div>
        )}

        {!loading && permitReviews && (
          <Table>
            <TableCaption>
              <PaginationComponent
                onPageChange={(page) => setCurrentPage(page)}
                data={permitReviews}
              />
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permitReviews?.data?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{formatLocaleDate(review.created_at)}</TableCell>
                  <TableCell className="font-medium">{review.reviewer?.name}</TableCell>
                  <TableCell>
                    {review.state_label ?? stringToTitleCase(review.state ?? '')}
                  </TableCell>
                  <TableCell>{review.comment}</TableCell>
                </TableRow>
              ))}
              {permitReviews?.data.length === 0 && (
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
