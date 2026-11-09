'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0E] text-white flex items-center justify-center min-h-screen p-6 font-mono">
        <div className="max-w-md w-full bg-[#12131A] rounded-2xl border border-white/10 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-bold">
            !
          </div>
          <h2 className="text-xl font-bold">Critical Application Error</h2>
          <p className="text-xs text-gray-400">
            {error?.message || 'A critical rendering error occurred.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Reload App
          </button>
        </div>
      </body>
    </html>
  );
}
