import { id } from 'date-fns/locale'
import ValidationError from './exceptions/validation-error'
import ServerError from './exceptions/server-error'
import {
  format,
  startOfToday,
  startOfWeek,
  endOfWeek,
  endOfToday,
  endOfMonth,
  endOfYear,
  subWeeks,
  startOfMonth,
  startOfYear,
  subMonths
} from 'date-fns'
import { toast } from 'sonner'

export function formatMoney(amount: number, digits = 0) {
  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: digits,
    style: 'currency',
    currency: 'IDR'
  })

  return formatter.format(amount)
}

export function ellipsisText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength) + '...'
}

export function formatNumber(
  value: number,
  digits = 0,
  prefix: string | null = null,
  suffix: string | null = null
): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: digits
  })

  let formatted = '-'

  if (value > 0) {
    formatted = `${prefix ?? ''}${formatter.format(value)}${suffix ?? ''}`
  }

  return formatted
}

export function formatLocaleDate(input?: string): string {
  if (!input) {
    return ''
  }

  const date = new Date(input)

  // Konversi ke zona waktu lokal Indonesia
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  }

  const tanggalFormatted = date.toLocaleDateString('id-ID', dateOptions)
  const waktuFormatted = date.toLocaleTimeString('id-ID', timeOptions)

  return `${tanggalFormatted}, pukul ${waktuFormatted}`
}

export function formatHumanDate(date: string, dateFormat = 'dd-LLL-yyyy') {
  return format(new Date(date), dateFormat, { locale: id })
}

export function formatHumanDateTime(date: string, dateFormat = 'dd-LLL-yyyy hh:mm') {
  return format(new Date(date), dateFormat, { locale: id })
}

export function parseQueryString({ params }: { params: any }): string {
  return Object.keys(params)
    .filter((key) => null !== params[key])
    .map((key) => key + '=' + params[key])
    .join('&')
}

export function quillOptions(): object {
  return {
    placeholder: '',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike', { list: 'ordered' }, { list: 'bullet' }, 'clean']
      ]
    },
    theme: 'snow'
  }
}

export function rowNumber(index: number, from: number | undefined = 0) {
  return from ? from + index : 1 + index
}

export function paginationStats(total: number, from = 0, to = 0): string {
  let stats = ''

  if (from > 0 && to > 0) {
    stats += `${from} &ndash; ${to} ${'from'} `
  }

  stats += total

  return stats
}

export function handleFocus(event: Event) {
  const target = event.target as HTMLInputElement
  if (target) {
    target.select()
  }
}

export const flashError = (err: unknown) => {
  if (err instanceof ValidationError) {
    toast.warning(err.message, {
      richColors: true
    })
  } else {
    toast.error(err instanceof ServerError ? err.message : 'Oops! Something went wrong.', {
      richColors: true
    })
  }
}

export const flashSuccess = (message: string, description: string | undefined = undefined) => {
  toast.success(message, {
    description: description,
    richColors: true
  })
}

export const presetDates = [
  { label: 'Today', value: [startOfToday(), endOfToday()] },
  { label: 'This week', value: [startOfWeek(new Date()), endOfWeek(new Date())] },
  {
    label: 'Last week',
    value: [startOfWeek(subWeeks(new Date(), 1)), endOfWeek(subWeeks(new Date(), 1))]
  },
  { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))]
  },
  { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] }
]

export const camelToTitleCase = (camelCaseString: string = ''): string => {
  const words = camelCaseString
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .split(' ')

  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const snakeToTitleCase = (string: string = ''): string => {
  const words = string.toLowerCase().split('_')

  const titleCase = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return titleCase
}

export const stringToTitleCase = (string: string = ''): string => {
  const words = string.toLowerCase().split(' ')

  const titleCase = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return titleCase
}

export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 500) {
  let timer: ReturnType<typeof setTimeout> | undefined

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer) // clear any pre-existing timer
    }

    const context = this // get the current context
    timer = setTimeout(() => {
      fn.apply(context, args) // call the function if time expires
    }, wait)
  }
}
