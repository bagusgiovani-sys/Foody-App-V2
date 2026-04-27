'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Star } from 'lucide-react';
import { useCreateReview } from '../hooks/useOrders';

interface ReviewModalProps {
  transactionId: string;
  restaurantId: number;
  restaurantName: string;
  onClose: () => void;
}

export default function ReviewModal({ transactionId, restaurantId, restaurantName, onClose }: ReviewModalProps) {
  const [star, setStar] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const { mutate: createReview, isPending } = useCreateReview();

  // Trap focus / close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSend = () => {
    if (star === 0) return;
    createReview(
      { transactionId, restaurantId, star, comment: comment || undefined },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(onClose, 1200);
        },
      }
    );
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="review-modal-title" className="text-xl font-bold text-gray-900">Give Review</h2>
          <button
            onClick={onClose}
            aria-label="Close review modal"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-green-600 font-semibold text-lg">Review submitted!</p>
          </div>
        ) : (
          <>
            {/* Star rating */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3 text-center">Give Rating</p>
              <div className="flex justify-center gap-2" role="group" aria-label="Star rating">
                {Array.from({ length: 5 }).map((_, i) => {
                  const val = i + 1;
                  const filled = val <= (hovered || star);
                  return (
                    <button
                      key={val}
                      aria-label={`${val} star${val > 1 ? 's' : ''}`}
                      onClick={() => setStar(val)}
                      onMouseEnter={() => setHovered(val)}
                      onMouseLeave={() => setHovered(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 transition ${
                          filled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <textarea
              rows={5}
              placeholder="Please share your thoughts about our service!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-6"
            />

            <button
              onClick={handleSend}
              disabled={star === 0 || isPending}
              className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-2xl transition"
            >
              {isPending ? 'Sending…' : 'Send'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
