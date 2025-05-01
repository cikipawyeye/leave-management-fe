import { SidebarProvider } from '~/components/ui/sidebar';
import { usePermission } from '~/contexts/permission-context';
import { useEffect } from 'react';
import { useAuth } from '~/hooks/use-auth';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: Readonly<AppShellProps>) {
    const isOpen = true;
    const { setRole, setPermissions } = usePermission();
    const { user } = useAuth();

    useEffect(() => {
        setRole(user?.role);
        setPermissions(user?.permissions ?? []);
    }, [user, setRole, setPermissions]);

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
