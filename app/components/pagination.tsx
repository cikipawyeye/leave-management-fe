import {
  Pagination as BasePagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination'

import { Pagination as Meta } from '~/types'

interface PaginationComponentProps<T> {
  data: Meta<T>
  onPageChange: (page: number) => void
}

export default function Pagination<T>({
  data,
  onPageChange
}: Readonly<PaginationComponentProps<T>>) {
  const { links } = data
  const {
    current_page,
    from,
    to,
    total = 0,
    prev_page_url: prevPageUrl,
    next_page_url: nextPageUrl
  } = data.meta

  const paginationItems = links
    .filter((link) => !link.label?.startsWith('Next') && !link.label?.endsWith('Previous'))
    .map((link) => ({
      type: link.label != '...' ? 'page' : 'ellipsis',
      label: link.label,
      url: link.url,
      active: link.active
    }))

  return (
    <>
      {prevPageUrl || nextPageUrl ? (
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <p className="my-auto text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{from}</span> to{' '}
            <span className="font-medium">{to}</span> of &nbsp;
            <span className="font-medium">{total}</span> results
          </p>

          <div className="my-auto">
            <BasePagination>
              <PaginationContent>
                <PaginationItem>
                  {prevPageUrl && (
                    <PaginationPrevious
                      onClick={() => onPageChange((current_page ?? 2) - 1)}
                      size={'default'}
                    />
                  )}
                </PaginationItem>

                {paginationItems.map((item, index) => (
                  <PaginationItem key={index * 5}>
                    {item.type === 'page' ? (
                      <PaginationLink
                        size={'default'}
                        onClick={() => (!isNaN(+item.label!) ? onPageChange(+item.label!) : {})}
                        isActive={item.active}
                      >
                        {item.label}
                      </PaginationLink>
                    ) : (
                      <PaginationEllipsis />
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  {nextPageUrl && (
                    <PaginationNext
                      onClick={() => onPageChange((current_page ?? 1) + 1)}
                      size={'default'}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </BasePagination>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-start text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{total}</span> results
          </p>
        </div>
      )}
    </>
  )
}
