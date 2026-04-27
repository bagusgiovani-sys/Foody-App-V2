// 📄 FILE: app/profile/page.tsx
'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProfileMenu from '@/features/profile/components/ProfileMenu';
import ProfileContent from '@/features/profile/components/ProfileContent';
import OrdersList from '@/features/orders/components/OrdersList';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');
  const { profile, isLoading } = useProfile();
  const { isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileContent profile={profile} />;
      case 'orders':
        return <OrdersList />;
      case 'delivery':
        return (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Address</h1>
            <p className="text-gray-600">Delivery address content coming soon...</p>
          </div>
        );
      default:
        return <ProfileContent profile={profile} />;
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-[280px_1fr] gap-8">
            {/* Left Sidebar */}
            <ProfileMenu 
              activeMenu={activeSection}
              onMenuChange={setActiveSection}
              profile={profile}
            />

            {/* Right Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}