'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AddPastActivityRedirect() {
  // Next.js routing hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract studentId from URL search parameters
  const studentId = searchParams.get('studentId');

  /**
   * Redirect Effect
   * 
   * Handles the automatic redirection based on the presence of studentId:
   * - With studentId: Redirects to /students/[id]/add-past-activity
   * - Without studentId: Redirects to /students (student selection page)
   * 
   * Uses router.replace() instead of router.push() to avoid adding
   * the redirect page to browser history.
   */
  useEffect(() => {
    if (studentId) {
      // Redirect to the proper dynamic route for adding past activity
      router.replace(`/students/${studentId}/add-past-activity`);
    } else {
      // No studentId provided - redirect to students list for selection
      router.replace('/students');
    }
  }, [studentId, router]);

  return (
    <div className="pt-20 flex justify-center items-center min-h-screen bg-[#f5f0e6]">
      <div className="text-emerald-700 text-center">
        {/* Loading spinner */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto mb-4"></div>
        {/* Loading message */}
        <p className="text-sm font-medium">Redirecting to add past activity...</p>
      </div>
    </div>
  );
}

export default function AddPastActivityPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 flex justify-center items-center min-h-screen bg-[#f5f0e6]">
        <div className="text-emerald-700 text-center">
          {/* Loading spinner */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          {/* Loading message */}
          <p className="text-sm font-medium">Loading...</p>
        </div>
      </div>
    }>
      <AddPastActivityRedirect />
    </Suspense>
  );
}
