"use client";

import { useRouter } from 'next/navigation';

export default function StudentEditButton({ studentId, className }) {
  const router = useRouter();
  return (
    <button
      onClick={e => {
        e.preventDefault();
        router.push(`/students/${studentId}/edit`);
      }}
      className={className || "text-sm font-medium text-gray-500 hover:text-gray-700"}
    >
      Edit
    </button>
  );
}
