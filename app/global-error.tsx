'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center font-sans">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-8">A critical error occurred. Please reload the page.</p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
