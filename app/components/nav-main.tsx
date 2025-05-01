import { NavLink } from 'react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar'
import { usePermission } from '~/contexts/permission-context'
import { type NavItem } from '~/types'

export function NavMain({ items = [] }: Readonly<{ items: NavItem[] }>) {
  const { hasPermission } = usePermission()

  const filteredItems = items.filter((item) => {
    if (!item.permission) return true
    return hasPermission(item.permission)
  })

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink
              to={item.href}
              children={({ isActive }) => (
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={{ children: item.title }}
                >
                  <div>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              )}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
