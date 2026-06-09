"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { CVDesignControls } from '@/components/cv-settings/CVDesignControls';

export default function CVSettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] overflow-hidden font-sans text-sm justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200">
        <CVDesignControls />
      </div>
    </div>
  );
}
