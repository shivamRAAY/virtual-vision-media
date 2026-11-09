'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#12131A] rounded-2xl border border-white/10 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-bold font-mono">
          !
        </div>
        <h2 className="text-xl font-bold font-mono">Application Error Encountered</h2>
        <p className="text-xs text-gray-400 font-mono">
          {error?.message || 'An unexpected rendering error occurred. You can reset or reload.'}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
