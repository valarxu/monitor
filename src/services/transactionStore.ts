import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '@/types/types'

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void
  setTransactions: (txs: Transaction[]) => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (tx) => 
        set((state) => ({
          transactions: [tx, ...state.transactions].slice(0, 100)
        })),
      setTransactions: (txs) => 
        set({ transactions: txs }),
    }),
    {
      name: 'transaction-storage',
    }
  )
) 