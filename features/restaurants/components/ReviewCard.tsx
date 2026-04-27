'use client';

import { Star } from 'lucide-react';
import type { ReviewDetail } from '../types';

interface ReviewCardProps {
  review: ReviewDetail;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        {review.user.avatar ? (
          <img
            src={review.user.avatar}
            alt={review.user.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{review.user.name}</p>
          <p className="text-sm text-gray-400">
            {new Date(review.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}
