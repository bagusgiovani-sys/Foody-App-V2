'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCheckout } from '@/features/checkout/hooks/useCheckout';
import { useAuthStore } from '@/store/useAuthStore';
import type { CartGroup } from '@/features/cart/types';

const PAYMENT_METHODS = [
  { id: 'BNI', label: 'Bank Negara Indonesia', logo: '/assets/banks/bni.png' },
  { id: 'BRI', label: 'Bank Rakyat Indonesia', logo: '/assets/banks/bri.png' },
  { id: 'BCA', label: 'Bank Central Asia', logo: '/assets/banks/bca.png' },
  { id: 'Mandiri', label: 'Mandiri', logo: '/assets/banks/mandiri.png' },
] as const;

const schema = z.object({
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  phone: z.string().min(5, 'Phone number is required'),
  paymentMethod: z.string().min(1, 'Select a payment method'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof schema>;

function formatPrice(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

function OrderItemRow({ name, price, qty }: { name: string; price: number; qty: number }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className="text-gray-700">
        {name} <span className="text-gray-400">×{qty}</span>
      </span>
      <span className="font-medium text-gray-900">{formatPrice(price * qty)}</span>
    </div>
  );
}

function CheckoutGroup({ group }: { group: CartGroup }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {group.restaurant.logo ? (
            <img src={group.restaurant.logo} alt={group.restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <span className="font-bold text-gray-900">{group.restaurant.name}</span>
      </div>
      <div className="px-6 py-4 space-y-1">
        {group.items.map((item) => (
          <OrderItemRow
            key={item.id}
            name={item.menu.name}
            price={item.menu.price}
            qty={item.quantity}
          />
        ))}
        <div className="flex justify-between pt-3 mt-2 border-t border-gray-100 text-sm font-semibold">
          <span className="text-gray-700">Subtotal</span>
          <span className="text-gray-900">{formatPrice(group.subtotal)}</span>
        </div>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 animate-pulse">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const restaurantIdParam = searchParams.get('restaurantId');
  const user = useAuthStore((s) => s.user);

  const { data: cart, isLoading } = useCart();
  const { mutate: checkout, isPending } = useCheckout();

  const groups = cart?.groups.filter((g) =>
    restaurantIdParam ? g.restaurant.id === Number(restaurantIdParam) : true
  ) ?? [];

  const subtotal = groups.reduce((s, g) => s + g.subtotal, 0);
  const totalItems = groups.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0), 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: user?.phone ?? '',
      paymentMethod: 'BNI',
    },
  });

  const onSubmit = (form: CheckoutForm) => {
    if (groups.length === 0) return;
    checkout({
      restaurants: groups.map((g) => ({
        restaurantId: g.restaurant.id,
        items: g.items.map((i) => ({ menuId: i.menu.id, quantity: i.quantity })),
      })),
      deliveryAddress: form.deliveryAddress,
      phone: form.phone,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-8 pb-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
            <CheckoutSkeleton />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (groups.length === 0) {
    return (
      <MainLayout>
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Nothing to checkout.</p>
            <button
              onClick={() => router.push('/cart')}
              className="text-red-600 font-semibold hover:underline"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-8 pb-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

              {/* Left: address + order items */}
              <div>
                {/* Delivery address card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <h2 className="font-bold text-gray-900">Delivery Address</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="deliveryAddress" className="sr-only">Delivery address</label>
                      <textarea
                        id="deliveryAddress"
                        rows={3}
                        placeholder="Enter your delivery address"
                        aria-invalid={!!errors.deliveryAddress}
                        aria-describedby={errors.deliveryAddress ? 'addr-error' : undefined}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        {...register('deliveryAddress')}
                      />
                      {errors.deliveryAddress && (
                        <p id="addr-error" className="mt-1 text-xs text-red-600">{errors.deliveryAddress.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="0812-3456-7890"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        id="notes"
                        type="text"
                        placeholder="e.g. Please ring the doorbell"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        {...register('notes')}
                      />
                    </div>
                  </div>
                </div>

                {/* Order items */}
                {groups.map((group) => (
                  <CheckoutGroup key={group.restaurant.id} group={group} />
                ))}
              </div>

              {/* Right: payment method + summary */}
              <div className="space-y-6">
                {/* Payment method */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-2" role="radiogroup" aria-label="Payment method">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-red-400 transition has-[:checked]:border-red-500 has-[:checked]:bg-red-50"
                      >
                        <div className="w-10 h-8 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-600">{method.id}</span>
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-800">{method.label}</span>
                        <input
                          type="radio"
                          value={method.id}
                          className="w-4 h-4 accent-red-600"
                          {...register('paymentMethod')}
                        />
                      </label>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="mt-2 text-xs text-red-600">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {/* Payment summary */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Payment Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                      <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="font-medium text-gray-400 italic">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service Fee</span>
                      <span className="font-medium text-gray-400 italic">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                    className="mt-6 w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-2xl transition text-base"
                  >
                    {isPending ? 'Placing order…' : 'Buy'}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
