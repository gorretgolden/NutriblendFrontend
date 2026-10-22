import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import TrackOrderClient from './TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Follow a NutriBlend Haven order with your order number and phone number. No account needed.',
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#009E3C]" />
        </div>
      }
    >
      <TrackOrderClient />
    </Suspense>
  );
}
