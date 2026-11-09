'use client';

import React, { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Dashboard caught error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#12131A] rounded-2xl border border-red-500/20 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-mono font-bold">
          !
        </div>
        <h2 className="text-xl font-bold font-mono">Terminal Rendering Issue</h2>
        <p className="text-xs text-gray-400 font-mono">
          {error?.message || 'An error occurred while loading the telemetry dashboard.'}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Reset Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
          >
            Hard Reload
          </button>
        </div>
      </div>
    </div>
  );
}
