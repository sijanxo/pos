'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, ShoppingCart, Package, BarChart3, Settings } from 'lucide-react';
import { Button } from './Button';
import { useAuthStore, useCanAccess } from '@/stores/authStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="loading-screen min-h-screen bg-background flex-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="top-nav bg-card border-b border-muted">
        <div className="nav-container flex items-center justify-between px-6 py-3">
          {/* Left: Logo and Navigation */}
          <div className="nav-left flex items-center gap-6">
            <div className="logo flex items-center gap-2">
              <div className="logo-icon w-8 h-8 bg-primary rounded flex-center">
                <ShoppingCart size={20} className="text-white" />
              </div>
              <span className="logo-text font-bold text-text">POS System</span>
            </div>

            <div className="nav-links flex items-center gap-1">
              <NavLink href="/sales" icon={<ShoppingCart size={16} />}>
                Sales
              </NavLink>
              
              {useCanAccess('inventory') && (
                <NavLink href="/inventory" icon={<Package size={16} />}>
                  Inventory
                </NavLink>
              )}
              
              {useCanAccess('reports') && (
                <NavLink href="/reports" icon={<BarChart3 size={16} />}>
                  Reports
                </NavLink>
              )}
              
              {useCanAccess('settings') && (
                <NavLink href="/settings" icon={<Settings size={16} />}>
                  Settings
                </NavLink>
              )}
            </div>
          </div>

          {/* Right: User Info and Logout */}
          <div className="nav-right flex items-center gap-4">
            <div className="user-info flex items-center gap-2">
              <User size={16} className="text-muted" />
              <div className="user-details">
                <span className="user-name text-sm font-medium text-text">
                  {user.username}
                </span>
                <span className="user-role text-xs text-muted ml-2 px-2 py-1 bg-gray-100 rounded">
                  {user.role}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut size={16} />}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavLink({ href, icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="nav-link flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-gray-100 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}