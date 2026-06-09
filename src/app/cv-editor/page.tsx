"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react';
import { ProfessionalCVEditor } from '@/components/cv-editor/ProfessionalCVEditor';
import { GovernmentCVPreview } from '@/components/cv-preview/GovernmentCVPreview';

export default function CVEditorPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] overflow-hidden font-sans text-sm">
      <ProfessionalCVEditor />
      <GovernmentCVPreview />
    </div>
  );
}
