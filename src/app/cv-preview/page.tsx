"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { CVPreview } from '@/components/cv-preview/CVPreview';

export default function CVPreviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] overflow-hidden font-sans text-sm justify-center">
      <div className="w-full max-w-5xl h-full shadow-lg">
        <CVPreview />
      </div>
    </div>
  );
}
