'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantCard from '@/features/restaurants/components/RestaurantCard';
import { useRestaurantList } from '@/features/restaurants/hooks/useRestaurants';
import type { RestaurantFilters } from '@/features/restaurants/types';

const DISTANCE_OPTIONS = [
  { label: 'Nearby', range: 10 },
  { label: 'Within 1 km', range: 1 },
  { label: 'Within 3 km', range: 3 },
  { label: 'Within 5 km', range: 5 },
] as const;

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  distance,
  onDistanceChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  ratings,
  onRatingToggle,
  onClose,
}: {
  distance: number | undefined;
  onDistanceChange: (range: number | undefined) => void;
  minPrice: string;
  onMinPriceChange: (v: string) => void;
  maxPrice: string;
  onMaxPriceChange: (v: string) => void;
  ratings: number[];
  onRatingToggle: (r: number) => void;
  onClose?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Filter</h3>
        {onClose && (
          <button onClick={onClose} aria-label="Close filter" className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Distance */}
      <fieldset className="mb-6">
        <legend className="font-semibold text-gray-900 mb-3">Distance</legend>
        <div className="space-y-2">
          {DISTANCE_OPTIONS.map(({ label, range }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="distance"
                checked={distance === range}
                onChange={() => onDistanceChange(range)}
                className="w-4 h-4 accent-red-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="distance"
              checked={distance === undefined}
              onChange={() => onDistanceChange(undefined)}
              className="w-4 h-4 accent-red-500"
            />
            <span className="text-sm text-gray-700">Any distance</span>
          </label>
        </div>
      </fieldset>

      {/* Price */}
      <fieldset className="mb-6">
        <legend className="font-semibold text-gray-900 mb-3">Price</legend>
        <div className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
            <input
              type="number"
              placeholder="Minimum Price"
              aria-label="Minimum price"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
            <input
              type="number"
              placeholder="Maximum Price"
              aria-label="Maximum price"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </fieldset>

      {/* Rating */}
      <fieldset>
        <legend className="font-semibold text-gray-900 mb-3">Rating</legend>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ratings.includes(r)}
                onChange={() => onRatingToggle(r)}
                className="w-4 h-4 rounded border-gray-300 accent-red-500"
              />
              <span className="text-yellow-400 text-lg leading-none">{'★'.repeat(r)}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse initial values from URL (set by category shortcuts)
  const [distance, setDistance] = useState<number | undefined>(
    searchParams.get('range') ? Number(searchParams.get('range')) : undefined
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('priceMin') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('priceMax') ?? '');
  const [ratings, setRatings] = useState<number[]>(
    searchParams.get('rating') ? [Number(searchParams.get('rating'))] : []
  );

  const toggleRating = useCallback((r: number) => {
    setRatings((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  }, []);

  const filters: RestaurantFilters = {
    ...(distance !== undefined && { range: distance }),
    ...(minPrice && { priceMin: Number(minPrice) }),
    ...(maxPrice && { priceMax: Number(maxPrice) }),
    // Send minimum selected rating (e.g. selecting 3★ and 4★ → rating=3)
    ...(ratings.length > 0 && { rating: Math.min(...ratings) }),
  };

  const { data, isLoading, isError } = useRestaurantList(filters);

  const filterProps = {
    distance,
    onDistanceChange: setDistance,
    minPrice,
    onMinPriceChange: setMinPrice,
    maxPrice,
    onMaxPriceChange: setMaxPrice,
    ratings,
    onRatingToggle: toggleRating,
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Restaurant</h1>
            <button
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium"
              onClick={() => setMobileFilterOpen(true)}
              aria-label="Open filters"
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start">
              <FilterPanel {...filterProps} />
            </aside>

            {/* Restaurant grid */}
            <div className="flex-1">
              {isError && (
                <p className="text-center text-gray-500 py-12">
                  Could not load restaurants. Please try again.
                </p>
              )}

              {!isError && (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  aria-live="polite"
                  aria-busy={isLoading}
                >
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
                    : data?.restaurants.length === 0
                    ? (
                      <p className="col-span-2 text-center text-gray-500 py-12">
                        No restaurants match your filters.
                      </p>
                    )
                    : data?.restaurants.map((r) => (
                        <RestaurantCard key={r.id} restaurant={r} />
                      ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-label="Filters"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto p-4">
            <FilterPanel {...filterProps} onClose={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
