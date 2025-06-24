"use client";

import { XMarkIcon } from '@heroicons/react/20/solid';

export default function BannerDismissButton({ onDismiss }) {
  return (
    <button
      type="button"
      className="-m-3 p-3 focus-visible:-outline-offset-4"
      onClick={onDismiss || (() => console.log('Banner dismissed'))}
    >
      <span className="sr-only">Dismiss</span>
      <XMarkIcon aria-hidden="true" className="size-5 text-emerald-900" />
    </button>
  );
}
