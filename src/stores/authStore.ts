import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import { mockUsers } from '@/lib/mockData';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils';

interface AuthStore extends AuthState {
  // Auth actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  
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
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,

        // Auth actions
        login: async (username: string, password: string): Promise<boolean> => {
          set({ isLoading: true });

          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock authentication - in real app, this would call an API
          const user = mockUsers.find(u => u.username === username);
          
          // Simple password check (in real app, passwords would be hashed)
          const validCredentials = {
            'admin': 'admin',
            'manager': 'manager',
            'cashier1': 'cashier1',
            'cashier2': 'cashier2',
          };

          if (user && validCredentials[username as keyof typeof validCredentials] === password) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Store auth token in localStorage (in real app, use secure storage)
            setLocalStorage('authToken', `token_${user.id}_${Date.now()}`);
            setLocalStorage('userId', user.id);
            
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
          
          // Clear stored auth data
          removeLocalStorage('authToken');
          removeLocalStorage('userId');
        },

        checkAuth: () => {
          const token = getLocalStorage('authToken', null);
          const userId = getLocalStorage('userId', null);
          
          if (token && userId) {
            // In real app, validate token with server
            const user = mockUsers.find(u => u.id === userId);
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          }
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
        // Only persist user and isAuthenticated, not isLoading
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
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