import React from 'react';
import { AppLayout } from '@/components/shared';

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}