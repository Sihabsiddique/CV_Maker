"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cv-editor');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 text-xs font-semibold text-gray-500">
      Redirecting to CV Architect...
    </div>
  );
}
