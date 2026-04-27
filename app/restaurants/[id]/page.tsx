'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Share2, Plus, Minus, ChevronLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useRestaurantDetail } from '@/features/restaurants/hooks/useRestaurant';
import { useAddToCart } from '@/features/cart/hooks/useCartMutation';
import { useAuthStore } from '@/store/useAuthStore';
import type { MenuItemDetail } from '@/features/restaurants/types';

type MenuTab = 'all' | 'food' | 'drink';

function formatPrice(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

// --- Skeletons ---
function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 h-72 animate-pulse">
      <div className="rounded-2xl bg-gray-200" />
      <div className="grid grid-rows-2 gap-3">
        <div className="rounded-2xl bg-gray-200" />
        <div className="rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

function InfoSkeleton() {
  return (
    <div className="animate-pulse space-y-3 py-6">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// --- Menu card ---
function MenuCard({
  item,
  restaurantId,
}: {
  item: MenuItemDetail;
  restaurantId: number;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { mutate: addToCart, isPending } = useAddToCart();
  const isLoggedIn = !!useAuthStore((s) => s.token);
  const router = useRouter();

  const handleAdd = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    addToCart(
      { restaurantId, menuId: item.id, quantity: qty },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
        <p className="text-lg font-bold text-gray-900 mb-3">{formatPrice(item.price)}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-semibold text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={isPending}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white'
            }`}
          >
            {added ? 'Added!' : isPending ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Review card ---
function ReviewCard({
  review,
}: {
  review: {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: { id: number; name: string; avatar: string };
  };
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        {review.user.avatar ? (
          <img src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{review.user.name}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
        ))}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}

// --- Page ---
export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const { data: restaurant, isLoading, isError } = useRestaurantDetail(id);

  const filteredMenus = restaurant?.menus.filter(
    (m) => activeTab === 'all' || m.type === activeTab
  ) ?? [];

  if (isError) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Restaurant not found.</p>
            <button onClick={() => router.push('/restaurants')} className="text-red-600 font-semibold hover:underline">
              Back to restaurants
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-4"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">

          {/* Gallery */}
          {isLoading ? (
            <GallerySkeleton />
          ) : (
            <div className="grid grid-cols-2 gap-3 h-72 mb-6">
              <div className="rounded-2xl overflow-hidden bg-gray-200">
                {restaurant!.images[0] && (
                  <img src={restaurant!.images[0]} alt={restaurant!.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="grid grid-rows-2 gap-3">
                <div className="rounded-2xl overflow-hidden bg-gray-200">
                  {restaurant!.images[1] && (
                    <img src={restaurant!.images[1]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl overflow-hidden bg-gray-200">
                    {restaurant!.images[2] && (
                      <img src={restaurant!.images[2]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-gray-200">
                    {restaurant!.images[3] && (
                      <img src={restaurant!.images[3]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info bar */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            {isLoading ? (
              <InfoSkeleton />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {restaurant!.logo && (
                      <img src={restaurant!.logo} alt={restaurant!.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{restaurant!.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-700">{restaurant!.rating}</span>
                      </span>
                      <span>{restaurant!.totalReviews} Reviews</span>
                      <span>·</span>
                      <span>{restaurant!.place}</span>
                      {restaurant!.distance != null && <span>· {restaurant!.distance} km</span>}
                    </div>
                  </div>
                </div>
                <button
                  aria-label="Share"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex-shrink-0"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            )}
          </div>

          {/* Menu section */}
          <section aria-labelledby="menu-heading" className="mb-10">
            <h2 id="menu-heading" className="text-2xl font-bold text-gray-900 mb-4">Menu</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6" role="tablist">
              {(['all', 'food', 'drink'] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    activeTab === tab
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'all' ? 'All Menu' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-5 bg-gray-200 rounded w-1/2" />
                      <div className="h-9 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMenus.length === 0 ? (
              <p className="text-gray-400 text-sm py-8 text-center">No items in this category.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredMenus.map((item) => (
                  <MenuCard key={item.id} item={item} restaurantId={restaurant!.id} />
                ))}
              </div>
            )}
          </section>

          {/* Review section */}
          <section aria-labelledby="review-heading">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 id="review-heading" className="text-2xl font-bold text-gray-900">Review</h2>
              {!isLoading && (
                <span className="flex items-center gap-1 text-gray-600 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{restaurant!.rating}</span>
                  <span>({restaurant!.totalReviews} Ulasan)</span>
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-16 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : restaurant!.reviews.length === 0 ? (
              <p className="text-gray-400 text-sm py-8 text-center">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant!.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
