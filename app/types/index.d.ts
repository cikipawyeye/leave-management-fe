import { LucideIcon } from 'lucide-react'
import type { Config } from 'ziggy-js'

export interface Auth {
  user: User
  permissions: string[]
}

export interface BreadcrumbItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon | null
  isActive?: boolean
  permission?: string
}

interface ResponseData<T = any> {
  data?: T
  message?: string
}

export interface Pagination<T = any> extends ResponseData {
  data: T[]
  links: {
    url: string | null
    label: string | null
    active: boolean
  }[]
  meta: {
    current_page: number | null
    first_page_url: string | null
    from: number | null
    last_page: number | null
    last_page_url: string | null
    next_page_url: string | null
    path: string | null
    per_page: number | null
    prev_page_url: string | null
    to: number | null
    total: number | null
  }
}

interface CursorPagination<T = any> extends ResponseData {
  data: T[]
  meta: {
    path: string
    per_page: number
    next_cursor: string | null
    prev_cursor: string | null
    next_page_url: string | null
    prev_page_url: string | null
  }
}

export interface User {
  id?: number
  name: string
  email: string
  avatar?: string
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
  role?: string
  permissions?: string[]
}

export interface Permit {
  id?: number
  type: 'sick' | 'leave' | 'other'
  title: string
  content: string
  state?: 'approved' | 'pending' | 'rejected' | 'revision' | 'canceled'
  created_at?: string
  state_label?: string
  user?: User
  type_label?: string
}

export interface PermitReview {
  id?: number
  comment?: string
  state?: 'approved' | 'rejected' | 'revision'
  created_at?: string
  state_label?: string
  reviewer?: User
}
