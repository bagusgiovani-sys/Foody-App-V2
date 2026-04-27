'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MapPin, ClipboardList, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
      pathname === href
        ? 'text-red-600 bg-red-50'
        : 'text-gray-700 hover:bg-gray-50'
    }`;

  const iconClass = (href: string) =>
    `w-5 h-5 ${pathname === href ? 'text-red-600' : 'text-gray-400'}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-1">
      {/* User header */}
      <div className="flex items-center gap-3 px-4 py-3 mb-2">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-semibold text-gray-900">{user?.name}</span>
      </div>

      <Link href="/profile" className={linkClass('/profile')}>
        <MapPin className={iconClass('/profile')} />
        Delivery Address
      </Link>

      <Link href="/orders" className={linkClass('/orders')}>
        <ClipboardList className={iconClass('/orders')} />
        My Orders
      </Link>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <LogOut className="w-5 h-5 text-gray-400" />
        Logout
      </button>
    </div>
  );
}
