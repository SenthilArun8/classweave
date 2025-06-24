'use client';

import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function UnderConstructionPage() {
  return (
    <section className='text-center flex flex-col justify-center items-center h-96 bg-[#162114] text-[#FFEDD2]'>
      <FaExclamationTriangle className='text-[#FFBBA6] text-6xl mb-4' />
      <h1 className='text-6xl font-bold mb-4'>Oops!</h1>
      <p className='text-xl mb-5'>This page is under construction. Please check back soon!</p>
      <Link
        href='/'
        className='text-[#162114] bg-[#FFEDD2] hover:bg-[#FFBBA6] rounded-md px-3 py-2 mt-4'
      >
        Go Back
      </Link>
    </section>
  );
}
