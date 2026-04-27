'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CartRestaurantGroup from '@/features/cart/components/CartRestaurantGroup';
import { useCart } from '@/features/cart/hooks/useCart';

function formatPrice(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

function CartSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
          </div>
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-200" />
                <div className="w-6 h-4 bg-gray-200 rounded" />
                <div className="w-8 h-8 rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="h-7 bg-gray-200 rounded w-24" />
            <div className="h-11 bg-gray-200 rounded-xl w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading, isError } = useCart();

  const handleCheckout = (restaurantId: number) => {
    router.push(`/checkout?restaurantId=${restaurantId}`);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 lg:px-8 pt-8 pb-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Cart</h1>

          {isLoading && <CartSkeleton />}

          {isError && (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">Failed to load cart.</p>
              <button
                onClick={() => window.location.reload()}
                className="text-red-600 font-semibold hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && cart && cart.groups.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-9 h-9 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add items from a restaurant to get started.</p>
              <Link
                href="/restaurants"
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition inline-block"
              >
                Browse Restaurants
              </Link>
            </div>
          )}

          {!isLoading && !isError && cart && cart.groups.length > 0 && (
            <>
              <div className="space-y-6">
                {cart.groups.map((group) => (
                  <CartRestaurantGroup
                    key={group.restaurant.id}
                    group={group}
                    onCheckout={handleCheckout}
                  />
                ))}
              </div>

              {/* Overall summary */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {cart.summary.restaurantCount} restaurant{cart.summary.restaurantCount > 1 ? 's' : ''}
                    {' · '}
                    {cart.summary.totalItems} item{cart.summary.totalItems > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(cart.summary.totalPrice)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
