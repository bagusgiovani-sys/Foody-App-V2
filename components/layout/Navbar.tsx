'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, MapPin, ClipboardList, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!useAuthStore((s) => s.token);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setDropdownOpen(false);
    router.push('/login');
  };

  const textColor = isScrolled ? 'text-gray-900' : 'text-white';
  const hoverBg = isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between py-6">
          <Link
            href="/"
            className={`flex items-center gap-2 text-2xl font-bold transition ${textColor}`}
          >
            <Image
              src={isScrolled ? '/assets/Logo/Color_Foody_Logo.svg' : '/assets/Logo/Foody_Logo.svg'}
              alt="Foody"
              width={40}
              height={40}
              priority
            />
            <span>Foody</span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/cart"
                  aria-label="Cart"
                  className={`relative p-2.5 rounded-full transition ${hoverBg}`}
                >
                  <ShoppingCart className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
                </Link>

                {/* Profile button + dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-3 rounded-full pl-2 pr-4 py-2 transition ${hoverBg}`}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user?.name && (
                      <span className={`font-medium ${textColor}`}>{user.name}</span>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                      role="menu"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-gray-900 text-sm">{user?.name}</span>
                      </div>

                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        Delivery Address
                      </Link>
                      <Link
                        href="/orders"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <ClipboardList className="w-4 h-4 text-gray-400" />
                        My Orders
                      </Link>
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-6 py-2.5 rounded-full font-medium transition border-2 ${
                    isScrolled
                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                      : 'border-white text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-full font-medium bg-white text-gray-900 hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
