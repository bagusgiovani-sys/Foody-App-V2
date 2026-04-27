import Image from 'next/image';

export function AuthHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Image
          src="/assets/Logo/Color_Foody_Logo.svg"
          alt="Foody"
          width={32}
          height={32}
        />
        <span className="text-xl font-bold text-gray-900">Foody</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
      <p className="text-gray-500 text-sm">Good to see you again! Let&apos;s eat</p>
    </div>
  );
}
