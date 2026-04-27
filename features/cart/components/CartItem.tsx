'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCartMutation';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { mutate: update, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: remove, isPending: isRemoving } = useRemoveCartItem();
  const isPending = isUpdating || isRemoving;

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      remove(item.id);
    } else {
      update({ id: item.id, quantity: item.quantity - 1 });
    }
  };

  const handleIncrease = () => {
    update({ id: item.id, quantity: item.quantity + 1 });
  };

  return (
    <div className={`flex items-center gap-4 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-gray-100">
        {item.menu.image ? (
          <img src={item.menu.image} alt={item.menu.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.menu.name}</h3>
        <p className="text-base font-bold text-gray-900">
          Rp{item.menu.price.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDecrease}
          disabled={isPending}
          aria-label={item.quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center transition"
        >
          {item.quantity <= 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5 text-gray-700" />}
        </button>
        <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          disabled={isPending}
          aria-label="Increase quantity"
          className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white flex items-center justify-center transition"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
