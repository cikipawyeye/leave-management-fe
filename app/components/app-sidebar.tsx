import { NavFooter } from '~/components/nav-footer';
import { NavMain } from '~/components/nav-main';
import { NavUser } from '~/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar';
import { type NavItem } from '~/types';
import { LayoutGrid, ListOrdered, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { Link } from 'react-router';
import { Permissions } from '~/Permission';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: '/users',
        icon: Users,
        permission: Permissions.MANAGE_USERS,
    },
    {
        title: 'User',
        href: '/ordinary-users',
        icon: Users,
        permission: Permissions.MANAGE_ORDINARY_USERS,
    },
    {
        title: 'Permits',
        href: '/permits',
        icon: ListOrdered,
        permission: Permissions.MANAGE_PERMITS,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
