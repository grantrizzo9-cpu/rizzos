"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AiStudioPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/ai-content/blog');
  }, [router]);

  return null;
}
