import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <Image
        src="/assets/Logo/Color_Foody_Logo.svg"
        alt="Foody"
        width={56}
        height={56}
        className="mb-6"
      />
      <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
