// 📄 FILE: app/restaurants/[id]/page.tsx
'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RestaurantDetailPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-1 rounded-2xl overflow-hidden h-64">
                <div className="w-full h-full bg-gray-800" />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden">
                    <div className="w-full h-full bg-gray-800" />
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <div className="w-full h-full bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-md p-3">
                  <div className="w-full h-full bg-orange-500 rounded-lg" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Burger King</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                    <span className="text-sm">Jakarta Selatan · 2.4 km</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <span>🔗</span>
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button className="px-6 py-2 bg-red-50 text-red-600 rounded-full font-medium">
              All Menu
            </button>
            <button className="px-6 py-2 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50">
              Food
            </button>
            <button className="px-6 py-2 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50">
              Drink
            </button>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-800 relative" />
                <div className="p-4">
                  <h3 className="font-semibold mb-1">Food Name</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Rp50.000</span>
                    <button className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Show More
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-2">Review</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-yellow-500">⭐</span>
            <span className="text-lg font-semibold">4.9 (24 Ulasan)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Michael Brown</h4>
                    <p className="text-sm text-gray-500">25 August 2025, 13:38</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  What a fantastic place! The food was delicious, and the ambiance was delightful. 
                  A must-visit for anyone looking for a great time!
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Show More
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}