'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!useAuthStore((s) => s.token);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  <ShoppingCart
                    className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                  />
                </Link>

                <Link
                  href="/profile"
                  className={`flex items-center gap-3 rounded-full pl-2 pr-4 py-2 transition ${hoverBg}`}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {user?.name && (
                    <span className={`font-medium ${textColor}`}>{user.name}</span>
                  )}
                </Link>
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
