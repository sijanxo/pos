'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check for existing authentication
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      router.push('/sales');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="loading-screen min-h-screen bg-background flex-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  );
}
