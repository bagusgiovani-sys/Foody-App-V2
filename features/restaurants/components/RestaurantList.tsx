'use client';

import Link from 'next/link';
import RestaurantCard from './RestaurantCard';
import { useRestaurantList } from '../hooks/useRestaurants';

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

export default function RecommendedSection() {
  const { data, isLoading, isError } = useRestaurantList({ limit: 6 });

  return (
    <section className="py-12 bg-gray-50" aria-labelledby="recommended-heading">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 id="recommended-heading" className="text-3xl font-bold text-gray-900">
            Recommended
          </h2>
          <Link
            href="/restaurants"
            className="text-red-500 font-semibold hover:text-red-600 transition text-sm"
          >
            See All
          </Link>
        </div>

        {isError && (
          <p className="text-center text-gray-500 py-12">
            Could not load restaurants. Please try again.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : data?.restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>

        {!isLoading && !isError && (
          <div className="flex justify-center">
            <Link
              href="/restaurants"
              className="px-10 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition"
            >
              Show More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
