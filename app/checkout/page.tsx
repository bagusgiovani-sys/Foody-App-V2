// 📄 FILE: app/checkout/page.tsx
'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Delivery & Items */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-6 h-6 text-red-600">📍</div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Delivery Address</h3>
                    <p className="text-sm text-gray-700 mb-1">
                      Jl. Sudirman No. 25, Jakarta Pusat, 10220
                    </p>
                    <p className="text-sm text-gray-600">0812-3456-7890</p>
                  </div>
                </div>
                <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                  Change
                </button>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-orange-500 rounded" />
                    </div>
                    <h3 className="font-bold">Burger Bang</h3>
                  </div>
                  <button className="text-sm text-red-600 font-medium">Add item</button>
                </div>

                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Food Name</h4>
                        <p className="text-lg font-bold">Rp50.000</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          -
                        </button>
                        <span className="w-8 text-center font-medium">1</span>
                        <button className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center">
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div className="space-y-6">
              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Bank Negara Indonesia', logo: 'BNI', checked: true },
                    { name: 'Bank Rakyat Indonesia', logo: 'BRI', checked: false },
                    { name: 'Bank Central Asia', logo: 'BCA', checked: false },
                    { name: 'Mandiri', logo: 'Mandiri', checked: false }
                  ].map((method) => (
                    <label key={method.name} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-red-500">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">
                        {method.logo}
                      </div>
                      <span className="flex-1 text-sm font-medium">{method.name}</span>
                      <input
                        type="radio"
                        name="payment"
                        defaultChecked={method.checked}
                        className="w-5 h-5"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4">Payment Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price (2 items)</span>
                    <span className="font-medium">Rp100.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">Rp10.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">Rp1.000</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-6">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold">Rp111.000</span>
                  </div>
                  <button className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}