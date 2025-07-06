'use client';

import { useState, useEffect } from 'react';
import BannerDismissButton from './clientComponents/BannerDismissButton';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('classweave-banner-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('classweave-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-emerald-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      {/* Left blurred shape */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-emerald-600 via-amber-300 to-emerald-800 opacity-30"
        />
      </div>
      {/* Right blurred shape */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-emerald-600 via-amber-300 to-emerald-800 opacity-30"
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6 text-emerald-900">
          <strong className="font-semibold">ClassWeave AI</strong>
          <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
            <circle r={1} cx={1} cy={1} />
          </svg>
          Try our new activity suggestions powered by AI!{' '}
          <span className="ml-2 font-semibold text-amber-700">(Beta: Page may take a while to load.)</span>
        </p>
        <a
          href="/at-home"
          className="flex-none rounded-full bg-emerald-700 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Try Now <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <BannerDismissButton onDismiss={handleDismiss} />
      </div>
    </div>
  );
};

export default Banner;
