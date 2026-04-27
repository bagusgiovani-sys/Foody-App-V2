'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        An unexpected error occurred. You can try again or return to the home page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
