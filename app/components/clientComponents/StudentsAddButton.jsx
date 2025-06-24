"use client";

import Link from 'next/link';

export default function StudentsAddButton() {
  return (
    <Link
      href="/add-student"
      className="mt-4 inline-block bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
    >
      Add Your First Student
    </Link>
  );
}
