import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type Role = string; // NOSONAR
type Permission = string; // NOSONAR

interface PermissionContextType {
    role: Role | undefined;
    setRole: (role: Role | undefined) => void;
    permissions: Permission[];
    setPermissions: (permissions: Permission[]) => void;
    hasPermission: (permission: Permission) => boolean;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const hasPermission = (permission: Permission) => {
        return permissions.includes(permission);
    };

    const value = useMemo(
        () => ({
            role,
            setRole,
            permissions,
            setPermissions,
            hasPermission,
            isLoading,
            setIsLoading,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [role, permissions, isLoading],
    );

    return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

export const usePermission = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermission must be used within a PermissionProvider');
    }
    return context;
};
