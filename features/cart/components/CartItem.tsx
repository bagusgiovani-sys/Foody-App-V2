// 📄 FILE: features/cart/components/CartItem.tsx
'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const handleDecrease = () => {
    // TODO: Implement decrease quantity logic
    console.log('Decrease quantity for item:', item.id);
  };

  const handleIncrease = () => {
    // TODO: Implement increase quantity logic
    console.log('Increase quantity for item:', item.id);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Food Image */}
      <div className="w-16 h-16 bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
      </div>

      {/* Food Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-lg font-bold text-gray-900">
          Rp{item.price.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button 
          onClick={handleDecrease}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
        >
          <Minus className="w-4 h-4 text-gray-700" />
        </button>
        <span className="w-8 text-center font-medium text-gray-900">
          {item.quantity}
        </span>
        <button 
          onClick={handleIncrease}
          className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}