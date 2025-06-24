'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function StudentRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Redirect to the proper dynamic route
    // If there's an id in search params, use it, otherwise redirect to students list
    const id = searchParams.get('id');
    if (id) {
      router.replace(`/students/${id}`);
    } else {
      router.replace('/students');
    }
  }, [router, searchParams]);

  return (
    <div className="pt-20 flex justify-center items-center min-h-screen">
      <div className="text-emerald-700 text-center">Redirecting...</div>
    </div>
  );
}

export default function StudentRoute() {
  return (
    <Suspense fallback={
      <div className="pt-20 flex justify-center items-center min-h-screen">
        <div className="text-emerald-700 text-center">Loading...</div>
      </div>
    }>
      <StudentRedirect />
    </Suspense>
  );
}
