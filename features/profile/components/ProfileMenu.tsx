// 📄 FILE: features/profile/components/ProfileMenu.tsx
'use client';

import React from 'react';
import { MapPin, FileText, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ApiProfile } from '../types';

interface ProfileMenuProps {
  activeMenu: string;
  onMenuChange: (menuId: string) => void;
  profile: ApiProfile | null;
}

export default function ProfileMenu({ activeMenu, onMenuChange, profile }: ProfileMenuProps) {
  const router = useRouter();

  const menuItems = [
    { id: 'profile', icon: FileText, label: profile?.name || 'User', isProfile: true },
    { id: 'delivery', icon: MapPin, label: 'Delivery Address' },
    { id: 'orders', icon: FileText, label: 'My Orders' },
    { id: 'logout', icon: LogOut, label: 'Logout' },
  ];

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'logout') {
      // TODO: Dispatch logout action from Redux
      // dispatch(logout());
      router.push('/login');
      return;
    }
    onMenuChange(menuId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          
          if (item.isProfile) {
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-orange-50' : 'hover:bg-gray-50'
                }`}
              >
                <img 
                  src={profile?.avatar || 'https://i.pravatar.cc/150?img=12'} 
                  alt={profile?.name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className={`font-medium ${isActive ? 'text-orange-500' : 'text-gray-900'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-orange-50' : 'hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-gray-600'}`} />
              <span className={`font-medium ${isActive ? 'text-orange-500' : 'text-gray-900'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}