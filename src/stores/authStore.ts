import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import { mockUsers } from '@/lib/mockData';

interface AuthStore extends AuthState {
  // Auth actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Permission helpers
  hasPermission: (action: string) => boolean;
  canAccess: (resource: string) => boolean;
}

// Define role permissions
const rolePermissions = {
  admin: [
    'sales.create', 'sales.read', 'sales.update', 'sales.delete',
    'inventory.create', 'inventory.read', 'inventory.update', 'inventory.delete',
    'users.create', 'users.read', 'users.update', 'users.delete',
    'reports.sales', 'reports.inventory', 'reports.financial',
    'settings.read', 'settings.update',
  ],
  manager: [
    'sales.create', 'sales.read', 'sales.update',
    'inventory.create', 'inventory.read', 'inventory.update',
    'users.read',
    'reports.sales', 'reports.inventory',
    'settings.read',
  ],
  cashier: [
    'sales.create', 'sales.read',
    'inventory.read',
  ],
};

// Resource access mapping
const resourceAccess = {
  admin: ['dashboard', 'sales', 'inventory', 'reports', 'users', 'settings'],
  manager: ['dashboard', 'sales', 'inventory', 'reports'],
  cashier: ['sales'],
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial state - start with admin user logged in for UI demo
      user: mockUsers[0], // Admin user
      isAuthenticated: true,
      isLoading: false,

      // Auth actions
      login: (username: string, password: string): boolean => {
        // Hard-coded credentials for UI demo
        const validCredentials = {
          'admin': 'admin',
          'manager': 'manager',
          'cashier1': 'cashier1',
          'cashier2': 'cashier2',
        };

        const user = mockUsers.find(u => u.username === username);
        
        if (user && validCredentials[username as keyof typeof validCredentials] === password) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Permission helpers
      hasPermission: (action: string): boolean => {
        const { user } = get();
        if (!user) return false;
        
        const permissions = rolePermissions[user.role] || [];
        return permissions.includes(action);
      },

      canAccess: (resource: string): boolean => {
        const { user } = get();
        if (!user) return false;
        
        const resources = resourceAccess[user.role] || [];
        return resources.includes(resource);
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Helper hooks for common permission checks
export const useHasPermission = (action: string) => {
  return useAuthStore(state => state.hasPermission(action));
};

export const useCanAccess = (resource: string) => {
  return useAuthStore(state => state.canAccess(resource));
};

export const useUserRole = () => {
  return useAuthStore(state => state.user?.role);
};

export const useIsAdmin = () => {
  return useAuthStore(state => state.user?.role === 'admin');
};

export const useIsManager = () => {
  return useAuthStore(state => state.user?.role === 'manager');
};

export const useIsCashier = () => {
  return useAuthStore(state => state.user?.role === 'cashier');
};