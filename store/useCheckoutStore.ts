import { create } from 'zustand';
import type { TransactionReceipt } from '@/features/checkout/types';

interface CheckoutState {
  receipt: TransactionReceipt | null;
  setReceipt: (receipt: TransactionReceipt) => void;
  clearReceipt: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  receipt: null,
  setReceipt: (receipt) => set({ receipt }),
  clearReceipt: () => set({ receipt: null }),
}));
