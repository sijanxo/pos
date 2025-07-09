'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // For UI demo, automatically redirect to sales
    router.push('/sales');
  }, [router]);

  return (
    <div className="loading-screen min-h-screen bg-background flex-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-muted">Loading POS System...</p>
      </div>
    </div>
  );
}
