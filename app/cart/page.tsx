// 📁 app/cart/page.tsx

'use client';

import { useMemo } from 'react';
import CartRestaurantGroup from '@/features/cart/components/CartRestaurantGroup';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import MainLayout from '@/components/layout/MainLayout';

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();

  // Group cart items by restaurant
  const cartGroups = useMemo(() => {
    const grouped = items.reduce((acc, item) => {
      const existingGroup = acc.find(
        (group) => group.restaurantId === item.restaurantId
      );

      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({
          id: item.restaurantId,
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          restaurantLogo: '', // Add logo URL from your restaurant data if available
          items: [item],
        });
      }

      return acc;
    }, [] as { id: string; restaurantId: string; restaurantName: string; restaurantLogo: string; items: typeof items }[]);

    return grouped;
  }, [items]);

  const handleCheckout = () => {
    router.push(ROUTES.CHECKOUT);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Empty cart state */}
        {items.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some delicious items to get started!
              </p>
              <button
                onClick={() => router.push(ROUTES.RESTAURANTS)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          </div>
        ) : (
          /* Cart with items */
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">My Cart</h1>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-orange-500">{totalItems}</p>
              </div>
            </div>

            {/* Cart Items Grouped by Restaurant */}
            <div className="space-y-6 mb-8">
              {cartGroups.map((group) => (
                <CartRestaurantGroup key={group.id} group={group} />
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}