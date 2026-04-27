'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import CartItem from './CartItem';
import type { CartGroup } from '../types';

interface CartRestaurantGroupProps {
  group: CartGroup;
  onCheckout: (restaurantId: number) => void;
}

function formatPrice(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

export default function CartRestaurantGroup({ group, onCheckout }: CartRestaurantGroupProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Restaurant header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {group.restaurant.logo ? (
            <img src={group.restaurant.logo} alt={group.restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <Link
          href={`/restaurants/${group.restaurant.id}`}
          className="flex-1 font-bold text-gray-900 hover:text-red-600 transition"
        >
          {group.restaurant.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>

      {/* Items */}
      <div className="px-6 py-4 space-y-4">
        {group.items.map((item, idx) => (
          <div key={item.id}>
            <CartItem item={item} />
            {idx < group.items.length - 1 && (
              <div className="mt-4 border-t border-dashed border-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* Footer: subtotal + checkout */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
          <p className="text-xl font-bold text-gray-900">{formatPrice(group.subtotal)}</p>
        </div>
        <button
          onClick={() => onCheckout(group.restaurant.id)}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
