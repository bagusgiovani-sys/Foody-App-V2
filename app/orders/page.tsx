'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import SidebarNav from '@/components/layout/SidebarNav';
import OrderCard from '@/features/orders/components/OrderCard';
import { useMyOrders } from '@/features/orders/hooks/useOrders';
import type { OrderStatus } from '@/features/orders/types';

const STATUS_TABS: { label: string; value: OrderStatus }[] = [
  { label: 'Preparing', value: 'preparing' },
  { label: 'On the Way', value: 'on_the_way' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Done', value: 'done' },
  { label: 'Canceled', value: 'cancelled' },
];

function OrderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border border-gray-100 rounded-2xl p-6 bg-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="h-5 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded-xl w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('done');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useMyOrders(activeStatus);

  const filtered = useMemo(() => {
    if (!data?.orders) return [];
    if (!search.trim()) return data.orders;
    const q = search.toLowerCase();
    return data.orders.filter((o) =>
      o.restaurants.some((r) => r.restaurant.name.toLowerCase().includes(q))
    );
  }, [data, search]);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <SidebarNav />
            </aside>

            {/* Main content */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search orders by restaurant"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Status tabs */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                <span className="text-sm font-semibold text-gray-700 flex-shrink-0 mr-1">Status</span>
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveStatus(tab.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
                      activeStatus === tab.value
                        ? 'bg-red-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Orders */}
              {isLoading && <OrderSkeleton />}

              {isError && (
                <div className="text-center py-16">
                  <p className="text-gray-500 mb-3">Failed to load orders.</p>
                  <button onClick={() => window.location.reload()} className="text-red-600 font-semibold hover:underline">
                    Try again
                  </button>
                </div>
              )}

              {!isLoading && !isError && filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-sm">No orders found.</p>
                </div>
              )}

              {!isLoading && !isError && filtered.length > 0 && (
                <div className="space-y-4">
                  {filtered.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
