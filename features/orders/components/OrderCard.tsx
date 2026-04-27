'use client';

import { useState } from 'react';
import type { ApiOrder } from '../types';
import ReviewModal from './ReviewModal';

interface OrderCardProps {
  order: ApiOrder;
}

function formatPrice(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [reviewTarget, setReviewTarget] = useState<{ restaurantId: number; restaurantName: string } | null>(null);

  return (
    <>
      {order.restaurants.map(({ restaurant, items, subtotal }) => (
        <div key={restaurant.id} className="border border-gray-100 rounded-2xl p-6 bg-white">
          {/* Restaurant header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <span className="font-bold text-gray-900">{restaurant.name}</span>
          </div>

          {/* First item preview */}
          {items[0] && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {items[0].image ? (
                  <img src={items[0].image} alt={items[0].menuName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{items[0].menuName}</p>
                <p className="text-sm text-gray-600">
                  {items[0].quantity} x {formatPrice(items[0].price)}
                </p>
                {items.length > 1 && (
                  <p className="text-xs text-gray-400 mt-0.5">+{items.length - 1} more item{items.length > 2 ? 's' : ''}</p>
                )}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200 mb-4" />

          {/* Total + Give Review */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Total</p>
              <p className="text-lg font-bold text-gray-900">{formatPrice(subtotal)}</p>
            </div>
            <button
              onClick={() => setReviewTarget({ restaurantId: restaurant.id, restaurantName: restaurant.name })}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Give Review
            </button>
          </div>
        </div>
      ))}

      {reviewTarget && (
        <ReviewModal
          transactionId={order.transactionId}
          restaurantId={reviewTarget.restaurantId}
          restaurantName={reviewTarget.restaurantName}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </>
  );
}
