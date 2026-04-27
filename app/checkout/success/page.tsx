'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { useCheckoutStore } from '@/store/useCheckoutStore';

function formatPrice(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const PAYMENT_LABELS: Record<string, string> = {
  BNI: 'Bank Negara Indonesia',
  BRI: 'Bank Rakyat Indonesia',
  BCA: 'Bank Central Asia',
  Mandiri: 'Mandiri',
};

function ReceiptRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 text-sm ${bold ? 'font-bold text-gray-900 text-base' : ''}`}>
      <span className={bold ? 'text-gray-900' : 'text-gray-500'}>{label}</span>
      <span className={bold ? 'text-gray-900' : 'text-gray-900 font-medium'}>{value}</span>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const receipt = useCheckoutStore((s) => s.receipt);
  const clearReceipt = useCheckoutStore((s) => s.clearReceipt);

  useEffect(() => {
    if (!receipt) {
      router.replace('/');
    }
  }, [receipt, router]);

  if (!receipt) return null;

  const paymentLabel = PAYMENT_LABELS[receipt.paymentMethod] ?? receipt.paymentMethod;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <Image src="/assets/Logo/Color_Foody_Logo.svg" alt="Foody" width={40} height={40} />
        <span className="text-2xl font-bold text-gray-900">Foody</span>
      </div>

      {/* Receipt card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center px-8 pt-10 pb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-9 h-9 text-white fill-white" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Payment Success</h1>
          <p className="text-sm text-gray-500 text-center">Your payment has been successfully processed.</p>
        </div>

        {/* Divider dashed */}
        <div className="mx-6 border-t border-dashed border-gray-200" />

        {/* Receipt rows */}
        <div className="px-8 py-2">
          <ReceiptRow label="Date" value={formatDate(receipt.createdAt)} />
          <div className="border-t border-dashed border-gray-100" />
          <ReceiptRow label="Payment Method" value={paymentLabel} />
          <div className="border-t border-dashed border-gray-100" />
          <ReceiptRow label={`Price (${receipt.totalItems} item${receipt.totalItems > 1 ? 's' : ''})`} value={formatPrice(receipt.pricing.subtotal)} />
          <div className="border-t border-dashed border-gray-100" />
          <ReceiptRow label="Delivery Fee" value={formatPrice(receipt.pricing.deliveryFee)} />
          <div className="border-t border-dashed border-gray-100" />
          <ReceiptRow label="Service Fee" value={formatPrice(receipt.pricing.serviceFee)} />
        </div>

        {/* Divider dashed */}
        <div className="mx-6 border-t border-dashed border-gray-200" />

        {/* Total + CTA */}
        <div className="px-8 pb-8">
          <ReceiptRow label="Total" value={formatPrice(receipt.pricing.totalPrice)} bold />

          <Link
            href="/orders"
            onClick={clearReceipt}
            className="mt-6 flex w-full items-center justify-center py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition text-base"
          >
            See My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
