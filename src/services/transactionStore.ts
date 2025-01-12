import { create } from 'zustand'

interface Transaction {
  signature: string
  type: string
  timestamp: number
}

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void
  setTransactions: (txs: Transaction[]) => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  addTransaction: (tx) => 
    set((state) => ({
      transactions: [tx, ...state.transactions].slice(0, 100) // 保留最新的100条
    })),
  setTransactions: (txs) => 
    set({ transactions: txs }),
})) 