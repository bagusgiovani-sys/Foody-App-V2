'use client';

import Link from 'next/link';

interface AuthTabsProps {
  activeTab: 'signin' | 'signup';
}

export function AuthTabs({ activeTab }: AuthTabsProps) {
  return (
    <div className="flex bg-gray-100 rounded-full p-1 mb-8" role="tablist">
      <Link
        href="/login"
        role="tab"
        aria-selected={activeTab === 'signin'}
        className={`flex-1 py-2 text-center text-sm font-semibold rounded-full transition-all ${
          activeTab === 'signin'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Sign in
      </Link>
      <Link
        href="/register"
        role="tab"
        aria-selected={activeTab === 'signup'}
        className={`flex-1 py-2 text-center text-sm font-semibold rounded-full transition-all ${
          activeTab === 'signup'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Sign up
      </Link>
    </div>
  );
}
